import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Book } from "@/types/book";
import { CartItem } from "@/types/cartItem";

interface UserCart {
    userId: number;
    items: CartItem[];
}

interface CartStore {
    guestCart: CartItem[];
    userCarts: UserCart[];
    currentUserId: number | null;
    addToCart: (book: Book, quantity: number) => void;
    increaseQuantity: (bookId: number) => void;
    decreaseQuantity: (bookId: number) => void;
    getBookQuantity: (bookId: number) => number;
    getCartTotals: () => number;
    getItemQuantity: () => number;
    setCurrentUserId: (userId: number | null) => void;
    migrateGuestCart: (userId: number) => void;
    clearCurrentCart: () => void;
    getCurrentCart: () => CartItem[];
    updateMismatchedPrices: (mismatches: {book_id: number, actual_price: number}[]) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            guestCart: [],
            userCarts: [],
            currentUserId: null,

            // Helper method to get the current cart (either guest cart or user cart)
            getCurrentCart: () => {
                const { currentUserId, guestCart, userCarts } = get();

                if (currentUserId === null) {
                    return guestCart;
                }

                const userCart = userCarts.find(cart => cart.userId === currentUserId);
                return userCart ? userCart.items : [];
            },

            getCartTotals: () => {
                const currentCart = get().getCurrentCart();
                return currentCart.reduce((total, item) => {
                    const price =
                        item.discount?.discount_price &&
                        typeof item.discount?.discount_price === "number" &&
                        item.discount?.discount_price > 0
                            ? item.discount?.discount_price
                            : item.book_price;
                    return total + price * item.quantity;
                }, 0);
            },

            addToCart: (book, quantity) => {
                set((state) => {
                    const currentCart = state.getCurrentCart();
                    const existing = currentCart.find((item) => item.id === book.id);

                    // Prepare the new cart item
                    let newCart: CartItem[];

                    if (existing) {
                        const newQuantity = existing.quantity + quantity;
                        if (newQuantity > 8) return state; // Do nothing if exceeds max

                        newCart = currentCart.map((item) =>
                            item.id === book.id
                                ? { ...item, quantity: newQuantity, total: newQuantity * item.book_price }
                                : item
                        );
                    } else {
                        if (quantity > 8) return state; // Do nothing if exceeds max
                        newCart = [...currentCart, { ...book, quantity, total: quantity * book.book_price }];
                    }

                    // Update the appropriate cart
                    if (state.currentUserId === null) {
                        return { guestCart: newCart };
                    } else {
                        const userCartIndex = state.userCarts.findIndex(cart => cart.userId === state.currentUserId);

                        if (userCartIndex >= 0) {
                            // Update existing user cart
                            const updatedUserCarts = [...state.userCarts];
                            updatedUserCarts[userCartIndex] = {
                                ...updatedUserCarts[userCartIndex],
                                items: newCart
                            };
                            return { userCarts: updatedUserCarts };
                        } else {
                            // Create new user cart
                            return {
                                userCarts: [
                                    ...state.userCarts,
                                    { userId: state.currentUserId, items: newCart }
                                ]
                            };
                        }
                    }
                });
            },

            increaseQuantity: (bookId) => {
                set((state) => {
                    const currentCart = state.getCurrentCart();
                    const newCart = currentCart.map((item) =>
                        item.id === bookId
                            ? {
                                  ...item,
                                  quantity: item.quantity < 8 ? item.quantity + 1 : 8,
                                  total: (item.quantity < 8 ? item.quantity + 1 : 8) * item.book_price,
                              }
                            : item
                    );

                    // Update the appropriate cart
                    if (state.currentUserId === null) {
                        return { guestCart: newCart };
                    } else {
                        const userCartIndex = state.userCarts.findIndex(cart => cart.userId === state.currentUserId);

                        if (userCartIndex >= 0) {
                            // Update existing user cart
                            const updatedUserCarts = [...state.userCarts];
                            updatedUserCarts[userCartIndex] = {
                                ...updatedUserCarts[userCartIndex],
                                items: newCart
                            };
                            return { userCarts: updatedUserCarts };
                        }
                        return state; // No changes if user cart not found
                    }
                });
            },

            decreaseQuantity: (bookId) => {
                set((state) => {
                    const currentCart = state.getCurrentCart();
                    const newCart = currentCart
                        .map((item) =>
                            item.id === bookId
                                ? {
                                      ...item,
                                      quantity: item.quantity - 1,
                                      total: (item.quantity - 1) * item.book_price,
                                  }
                                : item
                        )
                        .filter((item) => item.quantity > 0);

                    // Update the appropriate cart
                    if (state.currentUserId === null) {
                        return { guestCart: newCart };
                    } else {
                        const userCartIndex = state.userCarts.findIndex(cart => cart.userId === state.currentUserId);

                        if (userCartIndex >= 0) {
                            // Update existing user cart
                            const updatedUserCarts = [...state.userCarts];
                            updatedUserCarts[userCartIndex] = {
                                ...updatedUserCarts[userCartIndex],
                                items: newCart
                            };
                            return { userCarts: updatedUserCarts };
                        }
                        return state; // No changes if user cart not found
                    }
                });
            },

            getBookQuantity: (bookId) => {
                const currentCart = get().getCurrentCart();
                const item = currentCart.find((item) => item.id === bookId);
                return item ? item.quantity : 0;
            },

            getItemQuantity: () => {
                return get().getCurrentCart().length;
            },

            setCurrentUserId: (userId) => {
                set({ currentUserId: userId });
            },

            migrateGuestCart: (userId) => {
                set((state) => {
                    // If guest cart is empty, just set the user ID
                    if (state.guestCart.length === 0) {
                        return { currentUserId: userId };
                    }

                    // Check if user already has a cart
                    const userCartIndex = state.userCarts.findIndex(cart => cart.userId === userId);

                    if (userCartIndex >= 0) {
                        // User already has a cart, merge guest cart into it
                        const updatedUserCarts = [...state.userCarts];
                        const userCart = updatedUserCarts[userCartIndex];

                        // Merge guest cart items into user cart
                        const mergedItems = [...userCart.items];

                        state.guestCart.forEach(guestItem => {
                            const existingItemIndex = mergedItems.findIndex(item => item.id === guestItem.id);

                            if (existingItemIndex >= 0) {
                                // Item exists in user cart, update quantity (up to max 8)
                                const existingItem = mergedItems[existingItemIndex];
                                const newQuantity = Math.min(existingItem.quantity + guestItem.quantity, 8);

                                mergedItems[existingItemIndex] = {
                                    ...existingItem,
                                    quantity: newQuantity,
                                    total: newQuantity * existingItem.book_price
                                };
                            } else {
                                // Item doesn't exist in user cart, add it
                                mergedItems.push(guestItem);
                            }
                        });

                        updatedUserCarts[userCartIndex] = {
                            ...userCart,
                            items: mergedItems
                        };

                        return {
                            currentUserId: userId,
                            userCarts: updatedUserCarts,
                            guestCart: [] // Clear guest cart after migration
                        };
                    } else {
                        // User doesn't have a cart yet, create one from guest cart
                        return {
                            currentUserId: userId,
                            userCarts: [
                                ...state.userCarts,
                                { userId, items: [...state.guestCart] }
                            ],
                            guestCart: [] // Clear guest cart after migration
                        };
                    }
                });
            },

            clearCurrentCart: () => {
                set((state) => {
                    if (state.currentUserId === null) {
                        return { guestCart: [] };
                    } else {
                        const userCartIndex = state.userCarts.findIndex(cart => cart.userId === state.currentUserId);

                        if (userCartIndex >= 0) {
                            // Clear user's cart items
                            const updatedUserCarts = [...state.userCarts];
                            updatedUserCarts[userCartIndex] = {
                                ...updatedUserCarts[userCartIndex],
                                items: []
                            };
                            return { userCarts: updatedUserCarts };
                        }
                        return state; // No changes if user cart not found
                    }
                });
            },

            // Update only the mismatched prices in the cart
            updateMismatchedPrices: (mismatches) => {
                set((state) => {
                    const currentCart = state.getCurrentCart();

                    // Create a map of mismatched prices by book ID for faster lookup
                    const mismatchMap = new Map(
                        mismatches.map(mismatch => [mismatch.book_id, mismatch.actual_price])
                    );

                    // Update only the mismatched items in the cart
                    const updatedCart = currentCart.map(item => {
                        const newPrice = mismatchMap.get(item.id);

                        if (newPrice !== undefined) {
                            // Only update the price and total, keep everything else the same
                            const updatedItem: CartItem = {
                                ...item,
                                book_price: newPrice,
                                total: item.quantity * newPrice
                            };

                            // If the item has a discount, update it to reflect the new price
                            if (updatedItem.discount) {
                                updatedItem.discount = {
                                    ...updatedItem.discount,
                                    discount_price: newPrice // Use the new price as the discount price
                                };
                            }

                            return updatedItem;
                        }

                        return item;
                    });

                    // Update the appropriate cart
                    if (state.currentUserId === null) {
                        return { guestCart: updatedCart };
                    } else {
                        const userCartIndex = state.userCarts.findIndex(cart => cart.userId === state.currentUserId);

                        if (userCartIndex >= 0) {
                            // Update existing user cart
                            const updatedUserCarts = [...state.userCarts];
                            updatedUserCarts[userCartIndex] = {
                                ...updatedUserCarts[userCartIndex],
                                items: updatedCart
                            };
                            return { userCarts: updatedUserCarts };
                        }

                        return state; // No changes if user cart not found
                    }
                });
            },
        }),
        {
            name: "cart-store",
            partialize: (state) => ({
                guestCart: state.guestCart,
                userCarts: state.userCarts,
                currentUserId: state.currentUserId
            })
        }
    )
);
