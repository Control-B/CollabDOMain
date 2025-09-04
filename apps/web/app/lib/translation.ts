'use client';

// Lightweight client-side translation helper with pluggable provider.
// Defaults to LibreTranslate-compatible endpoints. You can override via:
// - localStorage: translateApiBase, translateApiKey
// - env: NEXT_PUBLIC_TRANSLATE_API, NEXT_PUBLIC_TRANSLATE_API_KEY

export type TranslateConfig = {
  baseUrl: string;
  apiKey?: string | null;
};

const getConfig = (): TranslateConfig => {
  let base = undefined as string | undefined;
  try {
    base = localStorage.getItem('translateApiBase') || undefined;
  } catch {}
  const envBase = (process as any)?.env?.NEXT_PUBLIC_TRANSLATE_API as
    | string
    | undefined;
  const baseUrl = base || envBase || 'https://libretranslate.com';

  let key = undefined as string | undefined;
  try {
    key = localStorage.getItem('translateApiKey') || undefined;
  } catch {}
  const envKey = (process as any)?.env?.NEXT_PUBLIC_TRANSLATE_API_KEY as
    | string
    | undefined;
  const apiKey = key || envKey || undefined;
  return { baseUrl, apiKey };
};

// Simple in-memory cache to avoid repeated calls for same text/lang
const cache = new Map<string, string>();

export const getUserLanguage = (): string => {
  try {
    const l = localStorage.getItem('userLanguage');
    return l || 'en';
  } catch {
    return 'en';
  }
};

export async function translateText(
  text: string,
  targetLang: string,
  opts?: { sourceLang?: string | 'auto'; signal?: AbortSignal },
): Promise<string> {
  const t = (targetLang || 'en').toLowerCase();
  if (!text || t.length === 0) return text;
  const key = `${opts?.sourceLang || 'auto'}|${t}|${text}`;
  if (cache.has(key)) return cache.get(key)!;

  const { baseUrl, apiKey } = getConfig();
  // If user hasn't configured anything and base is default, still attempt fetch.
  // Gracefully fallback to original text on any failure.
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: opts?.sourceLang || 'auto',
        target: t,
        format: 'text',
        api_key: apiKey || undefined,
      }),
      signal: opts?.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: any = await res.json();
    const translated = data?.translatedText || text;
    cache.set(key, translated);
    return translated;
  } catch {
    // Fallback to original text
    cache.set(key, text);
    return text;
  }
}
