import { Location } from '@angular/common';
import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2,
    ViewChild
} from '@angular/core';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { ConfigService, IConfig } from '../../config/config.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import {
    TransactionModalComponent
} from '../../shared/modal/transaction-modal/transaction-modal.component';
import { SIGN_UP_CONFIG } from '../../sign-up/sign-up.constant';
import {
    DASHBOARD_PATH, EDIT_PROFILE_PATH, SIGN_UP_ROUTE_PATHS
} from '../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { DefaultErrors } from '../modal/error-modal/default-errors';
import { INavbarConfig } from './config/navbar.config.interface';
import { NavbarConfig } from './config/presets';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})

export class NavbarComponent implements OnInit, AfterViewInit {
  browserError: boolean;
  navbarMode = 1; // Main Navbar Mode
  // Navbar Configuration (New)
  navbarConfig: any;

  showNavBackBtn = false; // Show Navbar1 Backbtn
  showHeaderBackBtn = true; // Show Navbar2 Backbtn
  showMenu = true;  // Show Menu Feature
  showLogin = true; // Show Login Feature
  showLogout = true; // Show Logout Feature only
  showNavShadow = true; // Navbar Show Shadow
  showSearchBar = false; // Navbar Show Search
  showNotifications = false; // Show Notifications Feature
  showHeaderNavbar = false; // Navbar Show on Mobile
  showHelpIcon = false; // Help Icon for Mobile (Direct/ Guide Me)
  showSettingsIcon = false; // Settings Icon for Mobile (Direct)
  showNotificationClear = false; // Notification Clear all Button
  showLabel: any;

  // Navbar Configurations
  modalRef: NgbModalRef; // Modal Ref
  pageTitle: string; // Page Title
  isNotificationHidden = true;
  subTitle = '';
  pageSuperTitle = '';
  filterIcon = false;
  currentUrl: string;
  backListener = '';
  isBackPressSubscribed = false;

  // Mobile Presets
  innerWidth: any;
  mobileThreshold = 567;
  isNavbarCollapsed = true;

  // Notifications Variables
  recentMessages: any;
  notificationCount: any;
  notificationLimit: number;

  isPromotionEnabled = false;
  isArticleEnabled = false;
  isWillWritingEnabled = false;
  isInvestmentEnabled = false;
  isNotificationEnabled = false;
  isComprehensiveEnabled = false;

  // Signed In
  isLoggedIn = false;
  userInfo: any;

  @ViewChild('navbar') NavBar: ElementRef;
  @ViewChild('navbarDropshadow') NavBarDropShadow: ElementRef;
  constructor(
    private navbarService: NavbarService, private _location: Location,
    private config: NgbDropdownConfig, private renderer: Renderer2,
    private cdr: ChangeDetectorRef, private router: Router, private configService: ConfigService,
    private signUpService: SignUpService, private authService: AuthenticationService,
    private modal: NgbModal,
    private appService: AppService,
    public defaultError: DefaultErrors,
    private investmentAccountService: InvestmentAccountService) {
    this.browserCheck();
    this.matrixResolver();
    config.autoClose = true;
    this.navbarService.getNavbarEvent.subscribe((data) => {
      this.navbarService.setNavbarDetails(this.NavBar);
    });

    this.configService.getConfig().subscribe((moduleConfig: IConfig) => {
      this.isArticleEnabled = moduleConfig.articleEnabled;
      this.isPromotionEnabled = moduleConfig.promotionEnabled;
      this.isWillWritingEnabled = moduleConfig.willWritingEnabled;
      this.isInvestmentEnabled = moduleConfig.investmentEnabled;
      this.isComprehensiveEnabled = moduleConfig.comprehensiveEnabled;
    });

    // User Information Check Authentication
    this.userInfo = this.signUpService.getUserProfileInfo();
    if (this.authService.isSignedUser()) {
      this.isLoggedIn = true;
    }
    // User Information
    this.signUpService.userObservable$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
        if (this.authService.isSignedUser()) {
          this.isLoggedIn = true;
        }
      }
    });

    // Log Out
    this.navbarService.logoutObservable$.subscribe((data) => {
      if (data === 'LOGGED_OUT') {
        this.clearLoginDetails();
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', [])
  checkScroll() { // Emiting Navbar Details to Navbar Service
    this.navbarService.setNavbarDetails(this.NavBar);
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.hideMenu();
    this.notificationLimit = SIGN_UP_CONFIG.NOTIFICATION_MAX_LIMIT;
    this.innerWidth = window.innerWidth;
    this.navbarService.currentPageTitle.subscribe((title) => {
        this.pageTitle = title;
      });
    this.navbarService.currentPageSubTitle.subscribe((subTitle) => {
      this.subTitle = subTitle;
    });
    this.navbarService.currentPageHelpIcon.subscribe((showHelpIcon) => {
      this.showHelpIcon = showHelpIcon;
      });
    this.navbarService.currentPageClearNotify.subscribe((showClearNotify) => {
      this.showNotificationClear = showClearNotify;
    });
    this.navbarService.currentPageSettingsIcon.subscribe((showSettingsIcon) => this.showSettingsIcon = showSettingsIcon);
    this.navbarService.currentPageFilterIcon.subscribe((filterIcon) => this.filterIcon = filterIcon);
    this.navbarService.isBackPressSubscribed.subscribe((subscribed) => {
      this.isBackPressSubscribed = subscribed;
    });
    this.navbarService.currentPageSuperTitle.subscribe((superTitle) => this.pageSuperTitle = superTitle);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url !== this.currentUrl) {
          this.currentUrl = this.router.url;
          this.hideMenu();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.navbarService.currentNavbarMobileVisibility.subscribe((showHeaderNavbar) => {
      this.showHeaderNavbar = showHeaderNavbar;
    });
    this.navbarService.currentNavbarMode.subscribe((navbarMode) => {
      this.navbarMode = navbarMode;
      this.matrixResolver(navbarMode);
      // Enabling Notifications
      if (this.navbarConfig.showNotifications) {
        this.isNotificationEnabled = true; // = this.canActivateNotification();
      } else {
        this.isNotificationEnabled = false;
      }

      if (this.isNotificationEnabled && this.authService.isSignedUser()) {
        this.getRecentNotifications();
      }
      this.cdr.detectChanges();
    });
    this.navbarService.currentNavbarShadowVisibility.subscribe((showNavShadow) => {
      this.showNavShadow = showNavShadow;
      this.cdr.detectChanges();
    });
  }

  // MATRIX RESOLVER --- DO NOT DELETE IT'S IMPORTANT
  matrixResolver(navbarMode?: any) {
    const matrix = new NavbarConfig();
    let nc: INavbarConfig;
    if (navbarMode ? true : false && (navbarMode !== 'default')) {
      this.navbarMode = navbarMode;
      nc = matrix[navbarMode];
      console.log('NavBar Mode: ' + navbarMode);
      // Just cos there is no automapper. FK
      this.processMatrix(nc);
    } else {
      this.navbarConfig = matrix['default'];
    }
  }

  processMatrix(nc: INavbarConfig) {
    // Buffer for Matrix
    Object.keys(nc).forEach((key) => {
      this.navbarConfig[key] = nc[key];
    });
    // Resetting Items to default
    if (!nc['showLabel']) {
      this.navbarConfig.showLabel = undefined;
    }
    // Implement Matrix
    const config = this.navbarConfig as INavbarConfig;
    this.showNavBackBtn = config.showNavBackBtn;
    this.showHeaderBackBtn = config.showHeaderBackBtn;
    this.showMenu = config.showMenu;
    this.showLogin = config.showLogin;
    this.showLogout = config.showLogout;
    this.showNavShadow = config.showNavShadow;
    this.showSearchBar = config.showSearchBar;
    this.showNotifications = config.showNotifications;
    this.showHeaderNavbar = config.showHeaderNavbar;
    this.showNotificationClear = false;
    this.showLabel = config.showLabel ? config.showLabel : false;
  }

  // End of MATRIX RESOLVER --- DO NOT DELETE IT'S IMPORTANT

  openSearchBar(toggle: boolean) {
    this.showSearchBar = toggle;
  }

  showMobilePopUp() {
    this.navbarService.showMobilePopUp(this.pageTitle);
  }

  goBack() {
    if (this.isBackPressSubscribed) {
      this.navbarService.backPressed(this.pageTitle);
    } else {
      this._location.back();
    }
  }

  goToExternal(url) {
    window.open(url, '_blank');
  }

  goToHome(in_fragment?: string) {
    if (in_fragment) {
      const extra = { fragment: in_fragment } as NavigationExtras;
      this.router.navigate([appConstants.homePageUrl], extra);
    } else {
      this.router.navigate([appConstants.homePageUrl]);
    }
  }

  openDropdown(dropdown) {
    if (this.innerWidth > this.mobileThreshold) {
      dropdown.open();
    }
  }

  closeDropdown(dropdown) {
    if (this.innerWidth > this.mobileThreshold) {
      dropdown.close();
    }
  }

  hideMenu() {
    this.isNavbarCollapsed = true;
  }

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    if (!this.isNotificationHidden && innerWidth < this.mobileThreshold) {
      this.isNotificationHidden = true;
      }
    }

  // Notification Methods
  getRecentNotifications() {
    this.signUpService.getRecentNotifications().subscribe((response) => {
      this.notificationCount = response.objectList[0].unreadCount;
      this.recentMessages = response.objectList[0].notifications[0].messages;
      this.recentMessages.map((message) => {
        message.time = parseInt(message.time, 10);
      });
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  toggleRecentNotification() {
    this.isNotificationHidden = !this.isNotificationHidden;
    if (!this.isNotificationHidden) { // When Opened
      if (this.recentMessages && this.recentMessages.length) {
        this.updateNotifications(this.recentMessages, SIGN_UP_CONFIG.NOTIFICATION.READ_PAYLOAD_KEY);
        }
    } else { // When closed
      this.getRecentNotifications();
    }
    // Checking navbar collapsed
    if (!this.isNavbarCollapsed && innerWidth < this.mobileThreshold) {
      this.isNavbarCollapsed = true;
      }
  }

  updateNotifications(messages, type) {
    this.signUpService.updateNotifications(messages, type).subscribe((response) => {
    });
  }

  viewAllNotifications() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.VIEW_ALL_NOTIFICATIONS]);
    this.isNotificationHidden = true;
  }

  canActivateNotification() {
    return (
      this.router.url === DASHBOARD_PATH ||
      this.router.url === EDIT_PROFILE_PATH
      );
  }
  clearNotifications() {
    this.navbarService.clearNotification();
  }
  // End of Notifications

  showFilterModalPopUp(data) {
    this.modalRef = this.modal.open(TransactionModalComponent, { centered: true });
  }

  // Logout Method
  logout() {
    if (this.authService.isSignedUser()) {
      this.authService.logout().subscribe((data) => {
        this.clearLoginDetails();
      });
    } else {
      this.clearLoginDetails();
    }
  }

  clearLoginDetails() {
    this.signUpService.setUserProfileInfo(null);
    this.isLoggedIn = false;
    this.authService.clearAuthDetails();
    this.appService.clearData();
    this.appService.startAppSession();
    this.router.navigate([appConstants.homePageUrl]);
  }

  // Route to Dashboard
  goToDashboard() {
    if (!this.authService.isSignedUser()) {
      this.clearLoginDetails();
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    }
  }

  // Browser Error Core Methods
  browserCheck() {
    const ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    const is_ie = ua.indexOf('MSIE ') > -1 ||
                  ua.indexOf('Trident/') > -1 ||
                  ua.toLowerCase().indexOf('firefox') > -1;
    if (is_ie) {
      this.browserError = true;
    } else {
      this.browserError = false;
    }
  }
  closeBrowserError() {
    this.browserError = false;
  }
}
