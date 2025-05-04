
import LocaleSelector from "@/components/LocaleSelector/LocaleSelector";

export default function Footer() {
    return (
        <footer className="footer sm:footer-horizontal bg-base-300 items-center p-4">
            <div className="flex items-center">
                <div className="">
                    <img src="/images/footer-logo.png" alt="Footer logo" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold">BOOKWORM</span>
                    <span>Address</span>
                    <span>Phone</span>
                </div>
            </div>
            <LocaleSelector />
        </footer>
    );
}