/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_BUCKET_NAME: string
  readonly VITE_CLOUDFRONT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
