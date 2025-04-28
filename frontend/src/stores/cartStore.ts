import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Book } from "@/types/book";
import { CartItem } from "@/types/cartItem";

interface CartStore {
    cart: CartItem[];
    addToCart: (book: Book, quantity: number) => void;
    increaseQuantity: (bookId: number) => void;
    decreaseQuantity: (bookId: number) => void;
    getBookQuantity: (bookId: number) => number;
    getCartTotals: () => number;
    getItemQuantity: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],
            getCartTotals: () => {
                return get().cart.reduce((total, item) => {
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
                    const existing = state.cart.find((item) => item.id === book.id);
                    if (existing) {
                        const newQuantity = existing.quantity + quantity;
                        if (newQuantity > 8) return state; // Do nothing if exceeds max
                        return {
                            cart: state.cart.map((item) =>
                                item.id === book.id
                                    ? { ...item, quantity: newQuantity, total: newQuantity * item.book_price }
                                    : item
                            ),
                        };
                    } else {
                        if (quantity > 8) return state; // Do nothing if exceeds max
                        return {
                            cart: [...state.cart, { ...book, quantity, total: quantity * book.book_price }],
                        };
                    }
                });
            },
            increaseQuantity: (bookId) => {
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.id === bookId
                            ? {
                                  ...item,
                                  quantity: item.quantity < 8 ? item.quantity + 1 : 8,
                                  total: (item.quantity < 8 ? item.quantity + 1 : 8) * item.book_price,
                              }
                            : item
                    ),
                }));
            },
            decreaseQuantity: (bookId) => {
                set((state) => ({
                    cart: state.cart
                        .map((item) =>
                            item.id === bookId
                                ? {
                                      ...item,
                                      quantity: item.quantity - 1,
                                      total: (item.quantity - 1) * item.book_price,
                                  }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                }));
            },
            getBookQuantity: (bookId) => {
                const item = get().cart.find((item) => item.id === bookId);
                return item ? item.quantity : 0;
            },
            getItemQuantity: () => {
                return get().cart.length;
            },
        }),
        { name: "cart-store" }
    )
);
