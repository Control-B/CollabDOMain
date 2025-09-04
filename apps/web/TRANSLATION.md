Translation in Chat (Client-side)

- Messages are stored/rendered in original language, but displayed translated for each viewer based on localStorage key `userLanguage` (set from the Language page).
- Uses a lightweight client-side helper targeting a LibreTranslate-compatible API.

Configure:

- Option A: Use defaults (https://libretranslate.com). No key required, but rate limits apply.
- Option B: Set env vars in apps/web:
  - NEXT_PUBLIC_TRANSLATE_API=https://your-translate-endpoint
  - NEXT_PUBLIC_TRANSLATE_API_KEY=your-key
- Option C: At runtime in browser console or via UI:
  - localStorage.setItem('translateApiBase', 'https://your-translate-endpoint')
  - localStorage.setItem('translateApiKey', 'your-key')

Notes:

- Translation happens on the client with caching; failures gracefully fall back to the original text.
- When you later persist messages to a backend, store the author’s language if available for better detection.
