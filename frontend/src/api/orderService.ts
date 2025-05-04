import axiosClient from "@api/axiosClient";
import { PlacedOrderItem } from "@/types/order";

const API_BASE_ROUTE = "/api/v1/orders";

export const orderService = {
    createOrder: (items: PlacedOrderItem[]) => axiosClient.post(`${API_BASE_ROUTE}`, { order_items: items }),
};
