import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useI18nStore } from "@/stores/i18nStore";

const locales = {
    "en-US": enUS,
    "vi-VN": vi,
} as const;

const formatMap: Record<keyof typeof locales, string> = {
    "en-US": "MMMM dd, yyyy", // April 12, 2021
    "vi-VN": "dd 'tháng' MM, yyyy", // 12 tháng 04, 2021
};

export function formatDate(date: string | Date, customFormat?: string): string {
    const language = useI18nStore.getState().language;
    const locale = locales[language] || enUS;
    const pattern = customFormat || formatMap[language] || "PP";
    return format(new Date(date), pattern, { locale });
}
