import PageTitle from "@/components/PageTitle";

interface PageLayoutProps {
    pageTitle: string;
    children: React.ReactNode;
}

export default function PageLayout({ pageTitle, children }: PageLayoutProps) {
    return (
        <div className="w-11/12 mx-auto pb-4">
            <PageTitle title={pageTitle} />
            {children}
        </div>
    );
}