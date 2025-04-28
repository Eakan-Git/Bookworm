import PageLayout from "@/layouts/PageLayout";
import { useCartStore } from "@/stores/cartStore";
import CartItemList from "@/components/CartDetails/CartItemList";
import CartTotals from "@/components/CartDetails/CartTotals";
export default function Cart() {
    const { getItemQuantity } = useCartStore();
    return (
        <>
            <PageLayout pageTitle={`Your cart: ${getItemQuantity()} items`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-3/5">
                        <CartItemList />
                    </div>
                    <div className="w-full md:w-2/5">
                        <CartTotals />
                    </div>
                </div>
            </PageLayout>
        </>
    );
}