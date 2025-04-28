import type { CartItem } from "@/types/cartItem";
import PriceDisplay from "@/components/PriceDisplay/PriceDisplay";
import { Minus, Plus } from "lucide-react";
import { memo } from "react";

interface CartItemProps {
    item: CartItem;
    onIncreaseQuantity: (id: number) => void;
    onDecreaseQuantity: (id: number) => void;
}

function CartItemComponent({ item, onIncreaseQuantity, onDecreaseQuantity }: CartItemProps) {
    const unitPrice = item.discount?.discount_price || item.book_price;
    const totalPrice = unitPrice * item.quantity;

    const MobileContent = () => (
        <div className="flex flex-col p-4 border-b border-base-content/10 lg:hidden">
            <div className="flex items-center gap-4 mb-3">
                <div className="min-w-16 w-16 h-16">
                    <img
                        className="w-full h-full object-cover rounded-sm"
                        src={item.book_cover_photo}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/images/book.png";
                        }}
                        alt=""
                    />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                    <h4 className="text-left font-medium truncate">{item.book_title}</h4>
                    <p className="text-sm text-base-content/60 truncate">{item.author.author_name}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Price:</span>
                <div className="text-right">
                    {item.discount?.discount_price ? (
                        <>
                            <PriceDisplay price={item.discount.discount_price} className="font-semibold" />
                            <PriceDisplay price={item.book_price} className="line-through text-base-content/60 text-sm" />
                        </>
                    ) : (
                        <PriceDisplay price={item.book_price} />
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex">
                    <button className="btn btn-sm rounded-none" onClick={() => onDecreaseQuantity(item.id)}><Minus size={16} /></button>
                    <div className="flex items-center justify-center bg-base-200 px-4">
                        <span className="label text-base-content">{item.quantity}</span>
                    </div>
                    <button className="btn btn-sm rounded-none" onClick={() => onIncreaseQuantity(item.id)}><Plus size={16} /></button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total:</span>
                <PriceDisplay price={totalPrice} className="font-bold" />
            </div>
        </div>
    );

    const DesktopContent = () => (
        <div className="hidden lg:flex p-4 border-b border-base-content/10">
            <div className="w-1/2 flex items-center gap-4">
                <div className="min-w-20 w-20 h-20">
                    <img
                        className="w-full h-full object-cover rounded-sm"
                        src={item.book_cover_photo}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/images/book.png";
                        }}
                        alt=""
                    />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <h4 className="text-left font-medium truncate">{item.book_title}</h4>
                    <p className="text-sm text-base-content/60 truncate">{item.author.author_name}</p>
                </div>
            </div>
            <div className="w-1/2 flex items-center justify-between">
                <div className="w-24 text-center">
                    {item.discount?.discount_price ? (
                        <>
                            <PriceDisplay price={item.discount.discount_price} className="font-semibold" />
                            <PriceDisplay price={item.book_price} className="line-through text-base-content/60 text-sm" />
                        </>
                    ) : (
                        <PriceDisplay price={item.book_price} />
                    )}
                </div>
                <div className="w-32 flex">
                    <button className="btn rounded-none" onClick={() => onDecreaseQuantity(item.id)}><Minus /></button>
                    <div className="w-full flex items-center justify-center bg-base-200">
                        <span className="label text-base-content p-2">{item.quantity}</span>
                    </div>
                    <button className="btn rounded-none" onClick={() => onIncreaseQuantity(item.id)}><Plus /></button>
                </div>
                <div className="w-24 text-center">
                    <PriceDisplay price={totalPrice} />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <MobileContent />
            <DesktopContent />
        </>
    );
}

export default memo(CartItemComponent);