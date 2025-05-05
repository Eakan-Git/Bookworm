import CollectionContainer from "@/components/CollectionContainer";
import { ChevronRight } from "lucide-react";
import BooksCarousel from "@/components/BooksCarousel/BooksCarousel";
import { useNavigate } from 'react-router-dom';
import { bookService } from "@/api/bookService";
import { useQuery } from '@tanstack/react-query';
import BookCardGrid from "@/components/BookCardGrid/BookCardGrid";
import TabsContainer from "@/components/TabsContainer/TabsContainer";
import { useTranslation } from "react-i18next";

export default function Home() {
    const navigate = useNavigate();
    const { t } = useTranslation("homepage");

    const onSaleHeaderContent = (
        <div className="flex items-center justify-between my-4">
            <h1 className="text-3xl font-bold">{t("sections.on_sale")}</h1>
            <button className="btn btn-accent text-info-content rounded-sm" onClick={() => {
                navigate('/shop');
            }}>
                {t("buttons.view_all")}
                <ChevronRight className="ml-2" />
            </button>
        </div>
    );
    const featuredHeaderContent = (
        <div className="flex justify-center items-center my-4">
            <h1 className="text-3xl font-bold">{t("sections.featured_books")}</h1>
        </div>
    );
    const { data: onSaleBooks } = useQuery({
        queryKey: ['on-sale'],
        queryFn: () => bookService.getOnSale().then(res => res.data.data),
    });
    const { data: popularBooks } = useQuery({
        queryKey: ['popular'],
        queryFn: () => bookService.getPopular().then(res => res.data.data),
    });
    const { data: recommendedBooks } = useQuery({
        queryKey: ['recommended'],
        queryFn: () => bookService.getRecommended(),
    });

    return (
        <>
            <CollectionContainer
                header={onSaleHeaderContent}
            >
                <BooksCarousel books={onSaleBooks || []} />
            </CollectionContainer>

            <TabsContainer
                header={featuredHeaderContent}
                tabs={[
                    {
                        name: t("sections.recommended"),
                        content: <BookCardGrid books={recommendedBooks?.data || []} className="md:w-10/12" />
                    },
                    {
                        name: t("sections.popular"),
                        content: <BookCardGrid books={popularBooks || []} className="md:w-10/12" />
                    }
                ]}
            />
        </>
    );
}