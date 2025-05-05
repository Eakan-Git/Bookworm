import { Book } from "@/types/book";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { cartConfig } from "@/configs/cartConfig";
import { Minus, Plus } from "lucide-react";
import PriceDisplay from "@/components/PriceDisplay/PriceDisplay";
import { useTranslation } from "react-i18next";

export default function AddToCart({ book, onAddToCart }: { book: Book, onAddToCart: (content: React.ReactNode) => void }) {
    const [quantity, setQuantity] = useState(cartConfig.minQuantity);
    const { addToCart, getBookQuantity } = useCartStore();
    const { t } = useTranslation(["bookdetails", "common"]);

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < cartConfig.minQuantity || newQuantity > cartConfig.maxQuantity) return;
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        const currentQuantity = getBookQuantity(book.id);

        // Case 1: Book already at max quantity in cart
        if (currentQuantity >= cartConfig.maxQuantity) {
            onAddToCart(
                <>
                    <h3 className="text-lg pb-4">{t("common:modals.max_quantity")}</h3>
                    <p>{t("common:modals.max_quantity_message", { max: cartConfig.maxQuantity, title: book.book_title })}</p>
                    <div className="modal-action">
                        <button className="btn btn-secondary" onClick={() => {
                            const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
                            dialog?.close();
                        }}>{t("common:buttons.close")}</button>
                    </div>
                </>
            );

            const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
            dialog.showModal();
            return;
        }

        // Case 2: Adding would exceed max quantity
        if (currentQuantity + quantity > cartConfig.maxQuantity) {
            const allowedToAdd = cartConfig.maxQuantity - currentQuantity;

            // Add the maximum allowed quantity
            addToCart(book, allowedToAdd);

            onAddToCart(
                <>
                    <h3 className="text-lg pb-4">{t("common:modals.max_quantity")}</h3>
                    <p>{t("common:modals.max_quantity_partial", { allowed: allowedToAdd, title: book.book_title })}</p>
                    <p>{t("common:modals.max_quantity_updated", { max: cartConfig.maxQuantity })}</p>
                    <div className="modal-action">
                        <button className="btn btn-secondary" onClick={() => {
                            const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
                            dialog?.close();
                        }}>{t("common:buttons.close")}</button>
                    </div>
                </>
            );

            const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
            dialog.showModal();
            return;
        }

        // Case 3: Book already in cart but not at max quantity
        if (currentQuantity > 0) {
            addToCart(book, quantity);

            onAddToCart(
                <>
                    <h3 className="text-lg pb-4">{t("common:modals.cart_updated")}</h3>
                    <p>{t("common:modals.cart_updated_message", { title: book.book_title })}</p>
                    <p>{t("common:modals.new_quantity", { quantity: currentQuantity + quantity })}</p>
                    <div className="modal-action">
                        <button className="btn btn-secondary" onClick={() => {
                            const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
                            dialog?.close();
                        }}>{t("common:buttons.close")}</button>
                    </div>
                </>
            );

            const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
            dialog.showModal();
            return;
        }

        // Case 4: New book added to cart
        addToCart(book, quantity);

        onAddToCart(
            <>
                <h3 className="text-lg pb-4">{t("common:modals.added_to_cart")}</h3>
                <p>{t("common:modals.added_to_cart_message", { title: book.book_title })}</p>
                <div className="modal-action">
                    <button className="btn btn-secondary" onClick={() => {
                        const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
                        dialog?.close();
                    }}>{t("common:buttons.close")}</button>
                </div>
            </>
        );

        const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
        dialog.showModal();
    };

    return (
        <>
            <div className="flex flex-col gap-2 border border-base-content/20 rounded-sm">
                <div className="flex gap-4 px-8 py-4 bg-base-200 border-b border-base-content/20">
                    {book.discount?.discount_price && (
                        <span className="line-through">
                            <PriceDisplay price={book.book_price} />
                        </span>
                    )}
                    <span className="font-semibold text-2xl">
                        <PriceDisplay price={book.discount?.discount_price || book.book_price} />
                    </span>
                </div>
                <div className="flex flex-col items-center p-8">
                    <div className="flex w-full">
                        <button
                            className="btn rounded-none"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            title={t("common:buttons.decrease")}
                        >
                            <Minus />
                        </button>
                        <div className="w-full flex items-center justify-center bg-base-200">
                            <span className="label text-base-content">{quantity}</span>
                        </div>
                        <button
                            className="btn rounded-none"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            title={t("common:buttons.increase")}
                        >
                            <Plus />
                        </button>
                    </div>
                    <div className="w-full">
                        <button className="btn btn-accent w-full mt-4" onClick={handleAddToCart}>
                            {t("common:buttons.add_to_cart")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}