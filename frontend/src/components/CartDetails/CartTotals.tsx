import { useCartStore } from "@/stores/cartStore";
import PriceDisplay from "@/components/PriceDisplay/PriceDisplay";

export default function CartTotals() {
    const { getCartTotals } = useCartStore();
    return (
        <div className="flex flex-col border border-base-content/20 rounded-sm">
            <div className="flex flex-col bg-base-200">
                <h1 className="text-2xl text-center font-bold p-4">Cart Totals</h1>
            </div>
            <div className="flex flex-col p-4 gap-4">
                <PriceDisplay className="text-2xl text-center" price={getCartTotals()} />
                <button className="btn btn-accent w-9/12 rounded-sm mx-auto">Place Order</button>
            </div>
        </div>
    );
}