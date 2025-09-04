namespace Osns;

public sealed record CompareRequest(
    string TenantId,
    IReadOnlyList<PoLine> Po,
    IReadOnlyList<ShipmentLine> Shipment,
    IReadOnlyList<ToleranceRule> Tolerances,
    IReadOnlyList<UomRule> Uoms);

public sealed record PoLine(string Sku, decimal Qty, string Uom);
public sealed record ShipmentLine(string Sku, decimal Qty, string Uom);

public sealed record ToleranceRule(string Sku, decimal? Percent, decimal? Absolute);
public sealed record UomRule(string From, string To, decimal Factor);

public sealed record CompareLineResult(string Sku, decimal Ordered, decimal Received, decimal Delta, string Status, string[] Reasons, double Confidence);
public sealed record CompareResult(IReadOnlyList<CompareLineResult> Lines, string Summary);
