import { Link } from 'react-router-dom';
import { Menu, LogOut, User } from "lucide-react";
import { useMenuItems } from "@/layouts/Navbar/Menu";
import { useLocation } from 'react-router-dom';
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "react-i18next";

const NavbarContent = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { getItemQuantity } = useCartStore();
    const { isAuthenticated, user, logout } = useAuthStore();
    const itemQuantity = getItemQuantity();
    const menuItems = useMenuItems();
    const { t } = useTranslation("common");

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {menuItems.map((item) => (
                <li key={item.id} className={currentPath === item.path ? 'link' : ''}>
                    <Link to={item.path || "#"} className="flex items-center space-x-2">
                        <span>
                            {item.label}
                            {item.id === "cart" && (
                                <span className="ml-1">
                                    {`(${itemQuantity})`}
                                </span>
                            )}
                        </span>
                    </Link>
                </li>
            ))}

            {isAuthenticated && user ? (
                <li>
                    <div className="dropdown dropdown-hover dropdown-end">
                        <div tabIndex={0} role="button" className="flex items-center gap-2">
                            <span>{user.fullName}</span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                            <li>
                                <button onClick={handleLogout} className="flex items-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    <span>{t("navbar.logout")}</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>
            ) : (
                <li
                    onClick={() => {
                        (document.getElementById('login-modal') as HTMLDialogElement)?.showModal()
                    }}
                >
                    <a className="cursor-pointer">
                        {t("navbar.login")}
                    </a>
                </li>
            )}
        </>
    );
}

const SidebarContent = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const menuItems = useMenuItems();
    const { t } = useTranslation("common");

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Main navigation items */}
            <ul className="menu gap-1">
                {menuItems.map((item) => (
                    <li key={item.id}>
                        <Link to={item.path || "#"} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300 transition">
                            {item.icon && <span className="text-lg">{item.icon}</span>}
                            <span className="text-base">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Divider */}
            <div className="divider my-2" />

            {/* Auth section */}
            {isAuthenticated && user ? (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-3 py-2 font-medium text-base">
                        <User className="h-5 w-5" />
                        <span>{user.fullName}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-base-300 transition"
                    >
                        <LogOut className="h-5 w-5 text-error" />
                        <span>{t("navbar.logout")}</span>
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => {
                        const modal = document.getElementById('login-modal') as HTMLDialogElement;
                        modal?.showModal();

                        const drawerCheckbox = document.getElementById('my-drawer-3') as HTMLInputElement;
                        if (drawerCheckbox) drawerCheckbox.checked = false;
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300 transition"
                >
                    <User className="h-5 w-5" />
                    <span>{t("navbar.login")}</span>
                </button>
            )}
        </div>
    );
};


export default function Navbar({ children }: { children: React.ReactNode }) {
    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar bg-base-300 w-full">

                    <div className="mx-2 flex-1 px-2">
                        <div className="flex items-center space-x-2">
                            <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
                            <Link to="/">
                                <span className="text-lg font-bold">Bookworm</span>
                            </Link>
                        </div>
                    </div>
                    <div className="hidden flex-none lg:block">
                        <ul className="menu menu-horizontal">
                            {/* Navbar menu content here */}
                            <NavbarContent />
                        </ul>
                    </div>
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <Menu className="h-5 w-5" />
                        </label>
                    </div>
                </div>
                {/* Page content here */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <SidebarContent />
                </ul>
            </div>
        </div>
    );
}
