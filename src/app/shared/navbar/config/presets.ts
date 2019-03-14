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
    };

    // ----- Core Function Profiles -----
    // DashBoard
    '100': object = {
      showNavBackBtn: false,
      showHeaderBackBtn: false,
      showMenu: true,
      showLogin: true,
      showNavShadow: true,
      showSearchBar: false,
      showNotifications: true,
      showHeaderNavbar: false
    };
    // Sign Up Journey
    '101': object = {
      showNavBackBtn: true,
      showHeaderBackBtn: true,
      showMenu: false,
      showLogin: false,
      showSearchBar: false,
      showNotifications: false,
      showHeaderNavbar: false
    };
    // Edit Profile
    '102': object = {
      showNavBackBtn: false,
      showHeaderBackBtn: true,
      showMenu: true,
      showLogin: true,
      showSearchBar: false,
      showNotifications: true,
      showHeaderNavbar: true,
    };

    // ------ Features -----
    // Home;
    '1': object = {
      showNavBackBtn: false,
      showHeaderBackBtn: false,
      showMenu: true,
      showLogin: true,
      showNavShadow: true,
      showSearchBar: false,
      showNotifications: true,
      showHeaderNavbar: false
    };
    // Direct/ Guide Me Journey (Robo1)
    '2': object = {
      showNavBackBtn: true,
      showHeaderBackBtn: true,
      showMenu: false,
      showLogin: false,
      showNavShadow: true,
      showSearchBar: false,
    };
    // Will-Writing (Robo1.5)
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
    // Investment (Robo2)
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
