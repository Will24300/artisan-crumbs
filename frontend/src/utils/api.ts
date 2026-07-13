// Central API base URL — set VITE_API_URL in production (Render env vars)
// In local dev this is "" and Vite's proxy forwards /api → localhost:5001
export const API_BASE = (import.meta.env.VITE_API_URL as string) ?? "";
