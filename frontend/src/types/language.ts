export const LANGUAGES = ["en-US", "vi-VN"] as const;
export type Language = (typeof LANGUAGES)[number];
