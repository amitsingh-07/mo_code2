import { SIGN_UP_ROUTE_PATHS } from 'src/app/sign-up/sign-up.routes.constants';

import { Location } from '@angular/common';
import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { SIGN_UP_CONFIG } from '../../sign-up/sign-up.constant';
import { SignUpService } from '../../sign-up/sign-up.service';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})

export class NavbarComponent implements OnInit, AfterViewInit {
  showMobileNavbar = false;
  navbarMode: number;
  showNavShadow: boolean;
  showSearchBar = false;
  notificationMaxLimit: number;
  isNotificationHidden = true;

  pageTitle: string;
  subTitle = '';
  helpIcon = false;
  closeIcon = false;
  settingsIcon = false;
  currentUrl: string;
  backListener = '';
  isBackPressSubscribed = false;

  innerWidth: any;
  mobileThreshold = 567;
  isNavbarCollapsed = true;
  recentMessages: any;
  count: any;
  isNotificationEnabled: boolean;
  @ViewChild('navbar') NavBar: ElementRef;
  @ViewChild('navbarDropshadow') NavBarDropShadow: ElementRef;
  constructor(
    private navbarService: NavbarService, private _location: Location,
    private config: NgbDropdownConfig, private renderer: Renderer2,
    private cdr: ChangeDetectorRef, private router: Router,
    private signUpService: SignUpService,
    public investmentAccountService: InvestmentAccountService,
  ) {
    config.autoClose = true;
    this.navbarService.getNavbarEvent.subscribe((data) => {
      this.navbarService.setNavbarDetails(this.NavBar);
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
    this.isNotificationEnabled = this.canActivateNotification();
    this.notificationMaxLimit = SIGN_UP_CONFIG.NOTIFICATION_MAX_LIMIT;
    this.innerWidth = window.innerWidth;
    this.navbarService.currentPageTitle.subscribe((title) => this.pageTitle = title);
    this.navbarService.currentPageSubTitle.subscribe((subTitle) => this.subTitle = subTitle);
    this.navbarService.currentPageHelpIcon.subscribe((helpIcon) => this.helpIcon = helpIcon);
    this.navbarService.currentPageProdInfoIcon.subscribe((closeIcon) => this.closeIcon = closeIcon);
    this.navbarService.currentPageSettingsIcon.subscribe((settingsIcon) => this.settingsIcon = settingsIcon);
    this.navbarService.isBackPressSubscribed.subscribe((subscribed) => {
      this.isBackPressSubscribed = subscribed;
    });

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
    this.navbarService.currentNavbarMobileVisibility.subscribe((showMobileNavbar) => {
      this.showMobileNavbar = showMobileNavbar;
    });
    this.navbarService.currentNavbarMode.subscribe((navbarMode) => {
      this.navbarMode = navbarMode;
      if (navbarMode !== 2) {
        this.isNotificationEnabled = this.canActivateNotification();
      } else {
        this.isNotificationEnabled = false;
      }
      if (this.isNotificationEnabled) {
        this.getRecentNotifications();
      }
      this.cdr.detectChanges();
    });
    this.navbarService.currentNavbarShadowVisibility.subscribe((showNavShadow) => {
      this.showNavShadow = showNavShadow;
      this.cdr.detectChanges();
    });
  }

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

  getRecentNotifications() {
    this.signUpService.getRecentNotifications().subscribe((response) => {
      //this.signUpService.setNotificationList(response.objectList.notifications);
      this.count = response.objectList.unreadCount;
      this.recentMessages = response.objectList.notifications[0].messages;
    });
  }

  toggleRecentNotification() {
    this.isNotificationHidden = !this.isNotificationHidden;
    if (!this.isNotificationHidden) { // When Opened
      const payload = this.constructPayloadForRead(this.recentMessages);
      this.signUpService.markNotificationsRead(payload).subscribe((response) => {
        
      });
    } else { // When closed
      this.getRecentNotifications();
    }
  }

  constructPayloadForRead(data) {
    return {
      messages: data
    };
  }

  viewAllNotifications() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.VIEW_ALL_NOTIFICATIONS]);
    this.isNotificationHidden = true;
  }

  canActivateNotification() {
    const userInfo = this.signUpService.getUserProfileInfo();
    if (!(userInfo && userInfo.firstName)) {
      return false;
    }
    return true;
  }
}
