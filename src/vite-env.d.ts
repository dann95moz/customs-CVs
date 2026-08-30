/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_FEEDBACK_ID?: string;
  readonly VITE_FORMSPREE_FEEDBACK_ENDPOINT?: string;
  readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
