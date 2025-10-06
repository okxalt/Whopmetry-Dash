/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAME_TITLE: string
  readonly VITE_DEFAULT_DIFFICULTY: string
  readonly VITE_MAX_LIVES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}