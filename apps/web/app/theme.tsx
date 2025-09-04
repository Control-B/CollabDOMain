// Dark-only theme helpers (no UI). Keeping file to avoid import churn.
export type Theme = 'dark';
export function applyTheme() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }
}
