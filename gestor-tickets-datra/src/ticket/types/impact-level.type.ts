export const IMPACT_LEVELS = [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
  'INFO',
] as const;

export type ImpactLevel = (typeof IMPACT_LEVELS)[number];
