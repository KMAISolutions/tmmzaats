/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly GEMINI_API_KEY: string; // Also include the existing GEMINI_API_KEY
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}