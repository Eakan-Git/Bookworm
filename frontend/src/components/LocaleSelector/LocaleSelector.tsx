import { useI18nStore } from "@/stores/i18nStore";
import { useCurrencyStore } from "@/stores/currencyStore";
import { currencyConfig } from "@/configs/currencyConfig";
import { Language, LANGUAGES } from "@/types/language";

// Map of languages to their display names and flags
const languageInfo = {
    "en-US": { name: "English", flag: "🇺🇸" },
    "vi-VN": { name: "Tiếng Việt", flag: "🇻🇳" },
};

export default function LocaleSelector() {
    const { language, setLanguage } = useI18nStore();
    const { setCurrency } = useCurrencyStore();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value as Language;

        // Set the language
        setLanguage(selectedLanguage);

        // Get the corresponding currency for this language
        const currencyForLanguage = currencyConfig.getCurrencyForLocale(selectedLanguage);

        // Set the currency
        setCurrency(currencyForLanguage);
    };

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Select Language & Currency</legend>
            <select
                value={language}
                className="select select-bordered w-full max-w-xs"
                onChange={handleChange}
            >
                {LANGUAGES.map((lang) => {
                    // Get the currency that corresponds to this language
                    const langInfo = languageInfo[lang] || { name: lang, flag: "🌐" };

                    return (
                        <option key={lang} value={lang}>
                            {langInfo.flag} {langInfo.name}
                        </option>
                    );
                })}
            </select>
        </fieldset>
    );
}
