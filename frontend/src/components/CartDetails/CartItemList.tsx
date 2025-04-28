import { useCartStore } from "@/stores/cartStore";
import CartItemComponent from "@/components/CartDetails/CartItem";
import { useCallback } from "react";

export default function CartItemListComponent() {
    const { cart, increaseQuantity, decreaseQuantity } = useCartStore();

    const handleIncreaseQuantity = useCallback((id: number) => {
        increaseQuantity(id);
    }, [increaseQuantity]);

    const handleDecreaseQuantity = useCallback((id: number) => {
        decreaseQuantity(id);
    }, [decreaseQuantity]);

    return (
        <div className="flex flex-col border border-base-content/20 rounded-sm">
            <div className="lg:hidden bg-base-200 p-4">
                <h4 className="text-center font-bold">Your Cart Items</h4>
            </div>

            <div className="hidden lg:flex bg-base-200 p-4">
                <div className="w-1/2">
                    <h4 className="text-left">Product</h4>
                </div>
                <div className="w-1/2 flex justify-between">
                    <h4 className="text-center w-24">Price</h4>
                    <h4 className="text-center w-32">Quantity</h4>
                    <h4 className="text-center w-24">Total</h4>
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