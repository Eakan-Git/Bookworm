import PageLayout from "@/layouts/PageLayout";
import { useTranslation } from "react-i18next";

export default function About() {
    const { t } = useTranslation("about");

    return (
        <PageLayout pageTitle={t("page_title")}>
            <div className="flex flex-col items-center md:w-8/12 mx-auto text-lg">

                <h2 className="text-3xl font-bold my-4 pb-4 text-center">{t("welcome_title")}</h2>
                <p className="py-4">
                    "{t("welcome_text")}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold my-4 text-center md:text-left">{t("story.title")}</h2>
                        <p className="py-4">
                            {t("story.paragraph1")}
                        </p>
                        <p className="py-4">
                            {t("story.paragraph2")}
                        </p>
                        <p className="py-4">
                            {t("story.paragraph3")}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold my-4 text-center md:text-left">{t("vision.title")}</h2>
                        <p className="py-4">
                            {t("vision.paragraph1")}
                        </p>
                        <p className="py-4">
                            {t("vision.paragraph2")}
                        </p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}