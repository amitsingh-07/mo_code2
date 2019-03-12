import { INavbarConfig } from './navbar.config.interface';

export class NavbarConfig {
    'default': object = {
      showNavBackBtn: false,
      showHeaderBackBtn: false,
      showMenu: true,
      showLogin: true,
      showNavShadow: true,
      showSearchBar: false,
      showNotifications: false,
      showHeaderNavbar: false
    } as INavbarConfig;

    '0': object = {
      showNavBackBtn: false,
      showHeaderBackBtn: false,
      showMenu: true,
      showLogin: true,
      showNavShadow: true,
      showSearchBar: false,
      showNotifications: true,
      showHeaderNavbar: false
    };
    '1': object = {
      showNavBackBtn: false,
      showHeaderBackBtn: false,
      showMenu: true,
      showLogin: true,
      showNavShadow: true,
      showSearchBar: false,
      showNotifications: false,
      showHeaderNavbar: false
    } as INavbarConfig;

    '2': object = {
      showNavBackBtn: true,
      showHeaderBackBtn: true,
      showMenu: false,
      showLogin: false,
      showNavShadow: true,
      showSearchBar: false,
    };

    '4': object = {
      showNavBackBtn: true,
      showHeaderBackBtn: true,
      showMenu: false,
      showLogin: false,
      showNavShadow: true,
      showSearchBar: false,
      showNotifications: false,
      showHeaderNavbar: false
    };

    '6': object = {
      showNavBackBtn: true,
      showHeaderBackBtn: true,
      showMenu: false,
      showLogin: false,
      showNavShadow: true,
      showSearchBar: false,
      showNotifications: false,
      showHeaderNavbar: true
    };
}
