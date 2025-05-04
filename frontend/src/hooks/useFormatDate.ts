import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useI18nStore } from "@/stores/i18nStore";
import { useMemo } from "react";

const locales = {
    "en-US": enUS,
    "vi-VN": vi,
} as const;

const formatMap: Record<keyof typeof locales, string> = {
    "en-US": "MMMM dd, yyyy", // April 12, 2021
    "vi-VN": "dd 'tháng' MM, yyyy", // 12 tháng 04, 2021
};

/**
 * React hook for formatting dates that updates when language changes
 * Use this in React components for reactive date formatting
 */
export function useFormatDate(date: string | Date, customFormat?: string): string {
    const language = useI18nStore(state => state.language);

    return useMemo(() => {
        const locale = locales[language] || enUS;
        const pattern = customFormat || formatMap[language] || "PP";
        return format(new Date(date), pattern, { locale });
    }, [date, language, customFormat]);
}
