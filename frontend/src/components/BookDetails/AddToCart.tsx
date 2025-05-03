import { Book } from "@/types/book";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { cartConfig } from "@/configs/cartConfig";
import { Minus, Plus } from "lucide-react";
import PriceDisplay from "@/components/PriceDisplay/PriceDisplay";

export default function AddToCart({ book, onAddToCart }: { book: Book, onAddToCart: (content: React.ReactNode) => void }) {
    const [quantity, setQuantity] = useState(cartConfig.minQuantity);
    const { addToCart, getBookQuantity } = useCartStore();

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < cartConfig.minQuantity || newQuantity > cartConfig.maxQuantity) return;
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        const currentQuantity = getBookQuantity(book.id);
        if (currentQuantity + quantity > cartConfig.maxQuantity) return;
        addToCart(book, quantity);

        onAddToCart(
            <>
                <h3 className="text-lg pb-4">Added to Cart!</h3>
                <p><span className="font-bold">{book.book_title}</span> has been added to your cart.</p>
                <div className="modal-action">
                    <button className="btn btn-secondary" onClick={() => {
                        const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
                        dialog?.close();
                    }}>Close</button>
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
                        <button className="btn rounded-none" onClick={() => handleQuantityChange(quantity - 1)}><Minus /></button>
                        <div className="w-full flex items-center justify-center bg-base-200">
                            <span className="label text-base-content">{quantity}</span>
                        </div>
                        <button className="btn rounded-none" onClick={() => handleQuantityChange(quantity + 1)}><Plus /></button>
                    </div>
                    <div className="w-full">
                        <button className="btn btn-accent w-full mt-4" onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        </>
    );
}   