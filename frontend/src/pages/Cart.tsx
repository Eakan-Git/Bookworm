import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/layouts/PageLayout";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import CartItemList from "@/components/CartDetails/CartItemList";
import CartTotals from "@/components/CartDetails/CartTotals";
import CloseOnClickOutSideModal from "@/components/CloseOnClickOutSideModal";
import { orderService } from "@/api/orderService";
import { PlacedOrderItem } from "@/types/order";
import { showLoginModal } from "@/utils/authUtils";

export default function Cart() {
    const navigate = useNavigate();
    const { getCurrentCart, getItemQuantity, clearCurrentCart, migrateGuestCart } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the current cart items
    const cart = getCurrentCart();

    // Effect to handle countdown timer
    useEffect(() => {
        if (countdown === null) return;

        if (countdown <= 0) {
            // Time's up, navigate to home
            clearCurrentCart();
            navigate('/');
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, navigate, clearCurrentCart]);

    // Handle login success - migrate guest cart to user cart
    useEffect(() => {
        if (isAuthenticated && user) {
            migrateGuestCart(user.id);
        }
    }, [isAuthenticated, user, migrateGuestCart]);

    const handlePlaceOrder = useCallback(async () => {
        // Check if user is logged in
        if (!isAuthenticated) {
            // Show login form
            showLoginModal();
            return;
        }

        if (cart.length === 0) {
            setModalContent(
                <div className="p-4">
                    <h3 className="text-lg font-bold mb-4">Empty Cart</h3>
                    <p>Your cart is empty. Please add some items before placing an order.</p>
                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                const dialog = document.getElementById('common-modal') as HTMLDialogElement;
                                dialog?.close();
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            );
            const dialog = document.getElementById('common-modal') as HTMLDialogElement;
            dialog?.showModal();
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare order items
            const orderItems: PlacedOrderItem[] = cart.map(item => ({
                book_id: item.id,
                quantity: item.quantity,
                price: item.discount?.discount_price &&
                    typeof item.discount?.discount_price === "number" &&
                    item.discount?.discount_price > 0
                    ? item.discount.discount_price
                    : item.book_price
            }));

            // Send order to server
            await orderService.createOrder(orderItems);

            // Show success modal with countdown
            setCountdown(10);
            setModalContent(
                <div className="p-4">
                    <h3 className="text-lg font-bold mb-4">Order Placed Successfully!</h3>
                    <p>Thank you for your order. Your books will be delivered soon.</p>
                    <p className="mt-2">Redirecting to home page in <span className="font-bold">{countdown}</span> seconds...</p>
                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                clearCurrentCart();
                                navigate('/');
                                const dialog = document.getElementById('common-modal') as HTMLDialogElement;
                                dialog?.close();
                            }}
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            );

            const dialog = document.getElementById('common-modal') as HTMLDialogElement;
            dialog?.showModal();
        } catch (error: any) {
            console.error('Order error:', error);

            // Check if it's a price mismatch error
            if (error.response?.status === 400 && error.response?.data?.detail?.mismatches) {
                const mismatches = error.response.data.detail.mismatches;

                setModalContent(
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4">Price Update</h3>
                        <p>Some prices have changed since you added items to your cart:</p>
                        <ul className="list-disc pl-5 my-2">
                            {mismatches.map((mismatch: any) => {
                                const book = cart.find(item => item.id === mismatch.book_id);
                                return (
                                    <li key={mismatch.book_id}>
                                        <span className="font-medium">{book?.book_title}</span>:
                                        <span className="line-through mx-1">${mismatch.expected_price.toFixed(2)}</span>
                                        <span className="font-bold">${mismatch.actual_price.toFixed(2)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <p>Please try placing your order again with the updated prices.</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const dialog = document.getElementById('common-modal') as HTMLDialogElement;
                                    dialog?.close();
                                    // Refresh the page to get updated prices
                                    window.location.reload();
                                }}
                            >
                                Update Prices
                            </button>
                        </div>
                    </div>
                );
            } else {
                // Generic error
                setModalContent(
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4">Order Failed</h3>
                        <p>There was an error processing your order. Please try again.</p>
                        <p className="text-error">{error.response?.data?.detail?.message || error.message}</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const dialog = document.getElementById('common-modal') as HTMLDialogElement;
                                    dialog?.close();
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                );
            }

            const dialog = document.getElementById('common-modal') as HTMLDialogElement;
            dialog?.showModal();
        } finally {
            setIsSubmitting(false);
        }
    }, [cart, isAuthenticated, clearCurrentCart, navigate, migrateGuestCart, countdown]);

    return (
        <>
            <PageLayout pageTitle={`Your cart: ${getItemQuantity()} items`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-3/5">
                        <CartItemList />
                    </div>
                    <div className="w-full md:w-2/5">
                        <CartTotals onPlaceOrder={handlePlaceOrder} isSubmitting={isSubmitting} />
                    </div>
                </div>
                <CloseOnClickOutSideModal modalId="common-modal">
                    {modalContent}
                </CloseOnClickOutSideModal>
            </PageLayout>
        </>
    );
}