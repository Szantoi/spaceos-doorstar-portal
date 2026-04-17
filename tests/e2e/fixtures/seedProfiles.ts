export const SEED_PROFILES = {
  EMPTY: 'empty-v1',
  SMOKE: 'doorstar-smoke-v1',
} as const;

export type SeedProfile = (typeof SEED_PROFILES)[keyof typeof SEED_PROFILES];
