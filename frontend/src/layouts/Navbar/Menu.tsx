import { MenuItem } from "@/types/menu";
import { Home, Info, ShoppingCart, ShoppingBag } from "lucide-react";

export const menuItems: MenuItem[] = [
    {
        id: "home",
        label: "Home",
        icon: <Home className="h-5 w-5" />,
        path: "/",
    },
    {
        id: "about",
        label: "About",
        icon: <Info className="h-5 w-5" />,
        path: "/about",
    },
    {
        id: "shop",
        label: "Shop",
        icon: <ShoppingBag className="h-5 w-5" />,
        path: "/shop",
    },
    {
        id: "cart",
        label: "Cart",
        icon: <ShoppingCart className="h-5 w-5" />,
        path: "/cart",
        trailing: "(0)",
    },
];