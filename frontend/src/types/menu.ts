export interface MenuItem {
    id: string;
    label: string;
    trailing?: string;
    icon?: React.ReactNode;
    path?: string;
    children?: MenuItem[];
}