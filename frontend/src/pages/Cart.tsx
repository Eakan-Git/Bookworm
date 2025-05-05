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
import { Book } from "@/types/book";
import { showLoginModal } from "@/utils/authUtils";
import { useTranslation } from "react-i18next";

export default function Cart() {
    const navigate = useNavigate();
    const { getCurrentCart, getItemQuantity, clearCurrentCart, migrateGuestCart, updateMismatchedPrices } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation("cart");

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

        // Update modal content with new countdown value
        if (countdown > 0) {
            setModalContent(
                <div className="p-4">
                    <h3 className="text-lg font-bold mb-4">{t("modals.order_success.title")}</h3>
                    <p>{t("modals.order_success.message")}</p>
                    <p className="mt-2">{t("modals.order_success.redirect", { seconds: countdown })}</p>
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
                            {t("modals.order_success.go_home")}
                        </button>
                    </div>
                </div>
            );
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
                    <h3 className="text-lg font-bold mb-4">{t("modals.empty_cart.title")}</h3>
                    <p>{t("modals.empty_cart.message")}</p>
                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                const dialog = document.getElementById('common-modal') as HTMLDialogElement;
                                dialog?.close();
                            }}
                        >
                            {t("modals.empty_cart.close")}
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
            // Set initial countdown value - the useEffect will update the modal content
            setCountdown(10);

            const dialog = document.getElementById('common-modal') as HTMLDialogElement;
            dialog?.showModal();
        } catch (error: any) {
            console.error('Order error:', error);

            // Check if it's a price mismatch error
            if (error.response?.status === 400 && error.response?.data?.detail?.mismatches) {
                const mismatches = error.response.data.detail.mismatches;

                // Update only the mismatched prices in the cart
                if (mismatches && mismatches.length > 0) {
                    // Create price updates for each mismatched book
                    const priceUpdates = mismatches.map((book: Book) => {
                        // Get the actual price from the book's discount or regular price
                        const actualPrice = book.discount?.discount_price || book.book_price || 0;

                        return {
                            book_id: book.id,
                            actual_price: actualPrice
                        };
                    });

                    updateMismatchedPrices(priceUpdates);
                }

                setModalContent(
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4">{t("modals.price_mismatch.title")}</h3>
                        <p>{t("modals.price_mismatch.details")}</p>
                        <ul className="list-disc pl-5 my-2">
                            {mismatches.map((book: Book) => {
                                // Find the current price in the cart
                                const cartItem = cart.find(item => item.id === book.id);
                                const expectedPrice = cartItem ?
                                    (cartItem.discount?.discount_price || cartItem.book_price) : 0;

                                // Get the actual price from the book's discount or regular price
                                const actualPrice = book.discount?.discount_price || book.book_price || 0;

                                return (
                                    <li key={book.id}>
                                        <span className="font-medium">{book.book_title}</span>:
                                        <span className="line-through mx-1">${expectedPrice.toFixed(2)}</span>
                                        <span className="font-bold">${actualPrice.toFixed(2)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <p>{t("modals.price_mismatch.updated_message")}</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const dialog = document.getElementById('common-modal') as HTMLDialogElement;
                                    dialog?.close();
                                }}
                            >
                                {t("modals.price_mismatch.close")}
                            </button>
                        </div>
                    </div>
                );
            } else {
                // Generic error
                setModalContent(
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4">{t("modals.order_failed.title")}</h3>
                        <p>{t("modals.order_failed.message")}</p>
                        <p className="text-error">{error.response?.data?.detail?.message || error.message}</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const dialog = document.getElementById('common-modal') as HTMLDialogElement;
                                    dialog?.close();
                                }}
                            >
                                {t("modals.order_failed.close")}
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
    }, [cart, isAuthenticated, clearCurrentCart, navigate, migrateGuestCart, updateMismatchedPrices, countdown]);

    return (
        <>
            <PageLayout pageTitle={t("your_cart_items", { count: getItemQuantity() })}>
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