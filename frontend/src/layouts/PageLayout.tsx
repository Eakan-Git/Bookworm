import PageTitle from "@/components/PageTitle";

interface PageLayoutProps {
    pageTitle: string;
    titleChildren?: string;
    children: React.ReactNode;
}

export default function PageLayout({ pageTitle, titleChildren, children }: PageLayoutProps) {
    return (
        <div className="w-11/12 mx-auto pb-4">
            <PageTitle title={pageTitle} titleChildren={titleChildren} />
            {children}
        </div>
    );
}