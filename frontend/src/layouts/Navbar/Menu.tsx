import { MenuItem } from "@/types/menu";
import { Home, Info, ShoppingCart, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

export const useMenuItems = (): MenuItem[] => {
    const { t } = useTranslation("common");

    return [
        {
            id: "home",
            label: t("navbar.home"),
            icon: <Home className="h-5 w-5" />,
            path: "/",
        },
        {
            id: "about",
            label: t("navbar.about"),
            icon: <Info className="h-5 w-5" />,
            path: "/about",
        },
        {
            id: "shop",
            label: t("navbar.shop"),
            icon: <ShoppingBag className="h-5 w-5" />,
            path: "/shop",
        },
        {
            id: "cart",
            label: t("navbar.cart"),
            icon: <ShoppingCart className="h-5 w-5" />,
            path: "/cart",
            trailing: "(0)",
        },
    ];
};