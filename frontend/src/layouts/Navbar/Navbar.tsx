import { Link } from 'react-router-dom';
import { Menu } from "lucide-react";
import { menuItems } from "@/layouts/Navbar/Menu";
import { useLocation } from 'react-router-dom';
import { useCartStore } from "@/stores/cartStore";

const NavbarContent = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { getItemQuantity } = useCartStore();
    const itemQuantity = getItemQuantity();
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
            <li
                onClick={() => {
                    console.log("Sign In clicked");
                }}
            >
                <a>
                    Sign In
                </a>
            </li>
        </>
    );
}

const SidebarContent = () => {
    return (
        <>
            {menuItems.map((item) => (
                <li key={item.id}>
                    <Link to={item.path || "#"} className="flex items-center space-x-2">
                        {item.icon && <span className="text-lg">{item.icon}</span>}
                        <span>{item.label}</span>
                    </Link>
                </li>
            ))}
        </>
    );
}

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
                            <span className="text-lg font-bold">Bookworm</span>
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