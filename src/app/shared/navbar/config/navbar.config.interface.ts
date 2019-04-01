export interface INavbarConfig {
    showNavBackBtn: boolean;
    showHeaderBackBtn: boolean;
    showMenu: true;
    showLogin: true;
    showLogout: false;
    showNavShadow: true;
    showSearchBar: false;
    showNotifications: boolean;
    showHeaderNavbar: false;
    showLabel ?: {
        'primary': string;
        'secondary' ?: string;
        };
    }
