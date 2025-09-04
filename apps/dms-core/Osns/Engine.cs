namespace Osns;

public static class Engine
{
    public static CompareResult Compare(CompareRequest req)
    {
        // Build UOM map
        var uomMap = req.Uoms.ToDictionary(u => $"{u.From}->{u.To}".ToLowerInvariant(), u => u.Factor);
        decimal Convert(string from, string to, decimal qty)
        {
            if (string.Equals(from, to, StringComparison.OrdinalIgnoreCase)) return qty;
            if (uomMap.TryGetValue($"{from}->{to}".ToLowerInvariant(), out var f)) return qty * f;
            // TODO: Invert or chain conversions if needed
            return qty; // TODO: surface missing conversion warning
        }

        // Tolerance map by SKU
        var tolMap = req.Tolerances.ToDictionary(t => t.Sku, t => t, StringComparer.OrdinalIgnoreCase);

        // Index shipment by SKU (simple)
        var shipBySku = req.Shipment.GroupBy(s => s.Sku, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => g.ToList(), StringComparer.OrdinalIgnoreCase);

        var results = new List<CompareLineResult>();
        foreach (var po in req.Po)
        {
            var ordered = po.Qty;
            var received = 0m;
            if (shipBySku.TryGetValue(po.Sku, out var ships))
            {
                foreach (var s in ships)
                {
                    received += Convert(s.Uom, po.Uom, s.Qty);
                }
            }
            var delta = received - ordered;

            tolMap.TryGetValue(po.Sku, out var tol);
            var within = IsWithinTolerance(delta, ordered, tol);
            var (status, reasons, conf) = Classify(delta, within);

            results.Add(new CompareLineResult(po.Sku, ordered, received, delta, status, reasons, conf));
        }

        var flagged = results.Count(r => r.Status == "FLAG");
        var summary = flagged == 0 ? "All lines within tolerance" : $"{flagged} lines flagged";
        return new CompareResult(results, summary);
    }

    static bool IsWithinTolerance(decimal delta, decimal ordered, ToleranceRule? tol)
    {
        if (tol is null) return delta == 0;
        var abs = Math.Abs(delta);
        if (tol.Absolute is not null && abs <= tol.Absolute.Value) return true;
        if (tol.Percent is not null)
        {
            var limit = Math.Abs(ordered) * (tol.Percent.Value / 100m);
            if (abs <= limit) return true;
        }
        return false;
    }

    static (string status, string[] reasons, double confidence) Classify(decimal delta, bool within)
    {
        if (within) return ("OK", Array.Empty<string>(), 0.95);
        var reasons = new List<string>();
        if (delta > 0) reasons.Add("over");
        if (delta < 0) reasons.Add("short");
        // TODO: consider partial, substitution, split based on additional fields
        return ("FLAG", reasons.ToArray(), 0.7);
    }
}
