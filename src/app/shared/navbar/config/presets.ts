import { INavbarConfig } from './navbar.config.interface';

export class NavbarConfig {
  'default': object = {
    showNavBackBtn: false,
    showHeaderBackBtn: false,
    showMenu: true,
    showLogin: true,
    showLogout: true,
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
    showHeaderNavbar: false,
    showExitCheck: true,
  };

  // Edit Profile
  '102': object = {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: true,
    showLogin: true,
    showSearchBar: false,
    showNotifications: true,
    showHeaderNavbar: true,
    showExitCheck: true,
  };

  // Topup and Withdraw
  '103': object = {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: true,
    showLogin: true,
    showLogout: true,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: true,
    showHeaderNavbar: true,
    showExitCheck: true,
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
    showHeaderNavbar: false,
    showExitCheck: false
  };

  // Direct/ Guide Me Journey (Robo1)
  '2': object = {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showLogout: false,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: false,
    showLabel: {
      primary: 'Insurance Adviser',
      secondary: 'powered by DIYInsurance'
    },
    showExitCheck: true
  };

  // Will-Writing (Robo1.5)
  '4': object = {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showLogout: true,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: false,
    showHeaderNavbar: false,
    showLabel: {
      primary: 'Will Writing'
    },
    showExitCheck: true
  };

  // Investment (Robo2)
  '6': object = {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showLogout: true,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: false,
    showHeaderNavbar: true,
    showLabel: {
      primary: 'Investment'
    },
    showExitCheck: true
  };

  // Comprehensive (Robo3)
  '7': object = {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showLogout: true,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: false,
    showHeaderNavbar: true,
    showLabel: {
      primary: 'Comprehensive Planning'
    }
  };

  // Retirement Planning (Robo1)
  '8': object = {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showLogout: true,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: false,
    showHeaderNavbar: false,
    showLabel: {
      primary: 'Retirement Planning'
    },
    showExitCheck: true
  };
}
