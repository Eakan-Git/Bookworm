
import LocaleSelector from "@/components/LocaleSelector/LocaleSelector";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation("common");

    return (
        <footer className="footer sm:footer-horizontal bg-base-300 items-center p-4">
            <div className="flex items-center">
                <div className="">
                    <img src="/images/footer-logo.png" alt="Footer logo" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold">BOOKWORM</span>
                    <span>{t("footer.address")}</span>
                    <span>{t("footer.phone")}</span>
                </div>
            </div>
            <LocaleSelector />
        </footer>
    );
}