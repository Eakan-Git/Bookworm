import { useCartStore } from "@/stores/cartStore";
import CartItemComponent from "@/components/CartDetails/CartItem";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CartItemListComponent() {
    const { getCurrentCart, increaseQuantity, decreaseQuantity } = useCartStore();
    const { t } = useTranslation("cart");

    // Get the current cart items
    const cart = getCurrentCart();

    const handleIncreaseQuantity = useCallback((id: number) => {
        increaseQuantity(id);
    }, [increaseQuantity]);

    const handleDecreaseQuantity = useCallback((id: number) => {
        decreaseQuantity(id);
    }, [decreaseQuantity]);

    // Empty cart state
    if (cart.length === 0) {
        return (
            <div className="flex flex-col border border-base-content/20 rounded-sm">
                <div className="bg-base-200 p-4">
                    <h4 className="text-center font-bold">{t("cart_items.header")}</h4>
                </div>

                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-base-content/70">{t("cart_items.empty_message")}</p>
                        <Link to="/shop" className="btn btn-primary">
                            {t("cart_items.browse_books")}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Cart with items
    return (
        <div className="flex flex-col border border-base-content/20 rounded-sm">
            <div className="lg:hidden bg-base-200 p-4">
                <h4 className="text-center font-bold">{t("cart_items.header")}</h4>
            </div>

            <div className="hidden lg:flex bg-base-200 p-4">
                <div className="w-1/2">
                    <h4 className="text-left">{t("cart_items.product")}</h4>
                </div>
                <div className="w-1/2 flex justify-between">
                    <h4 className="text-center w-24">{t("cart_items.price")}</h4>
                    <h4 className="text-center w-32">{t("cart_items.quantity")}</h4>
                    <h4 className="text-center w-24">{t("cart_items.total")}</h4>
                </div>
            </div>

            {cart.map((item) => (
                <CartItemComponent
                    key={item.id}
                    item={item}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                />
            ))}
        </div>
    );
}