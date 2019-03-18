export let NAV_BAR_CONFIG = {
  default:  {
    showNavBackBtn: false,
    showHeaderBackBtn: false,
    showMenu: true,
    showLogin: true,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: false,
    showHeaderNavbar: false
  },

  // ----- Core Function Profiles -----
  // DashBoard
  100:  {
    showNavBackBtn: false,
    showHeaderBackBtn: false,
    showMenu: true,
    showLogin: true,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: true,
    showHeaderNavbar: false
  },
  // Sign Up Journey
  101:  {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showSearchBar: false,
    showNotifications: false,
    showHeaderNavbar: false
  },
  // Edit Profile
  102:  {
    showNavBackBtn: false,
    showHeaderBackBtn: true,
    showMenu: true,
    showLogin: true,
    showSearchBar: false,
    showNotifications: true,
    showHeaderNavbar: true,
  },

  // ------ Features -----
  // Home,
  1:  {
    showNavBackBtn: false,
    showHeaderBackBtn: false,
    showMenu: true,
    showLogin: true,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: true,
    showHeaderNavbar: false
  },
  // Direct/ Guide Me Journey (Robo1)
  2:  {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showNavShadow: true,
    showSearchBar: false,
    showLabel: {
      primary: 'Insurance Adviser',
      secondary: 'powered by DIYInsurance'
    }
  },
  // Will-Writing (Robo1.5)
  4:  {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: false,
    showHeaderNavbar: false,
    showLabel: {
      primary: 'Will Writing'
    }
  },
  // Investment (Robo2)
  6:  {
    showNavBackBtn: true,
    showHeaderBackBtn: true,
    showMenu: false,
    showLogin: false,
    showNavShadow: true,
    showSearchBar: false,
    showNotifications: false,
    showHeaderNavbar: true,
    showLabel: {
      primary: 'Investment'
    }
  }
};
