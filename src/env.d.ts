/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_BUCKET_NAME: string
  readonly VITE_CLOUDFRONT_URL: string;
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
