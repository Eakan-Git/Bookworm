export const CURRENCIES = ["USD", "VND", "THB"] as const;
export type Currency = (typeof CURRENCIES)[number];
