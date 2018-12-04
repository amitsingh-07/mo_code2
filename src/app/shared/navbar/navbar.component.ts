import { Location } from '@angular/common';
import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2,
    ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService, IConfig } from '../../config/config.service';
import {
    INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import {
    TransactionModalComponent
} from '../../shared/modal/transaction-modal/transaction-modal.component';
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
  modalRef: NgbModalRef;
  pageTitle: string;
  subTitle = '';
  helpIcon = false;
  closeIcon = false;
  settingsIcon = false;
  filterIcon = false;
  currentUrl: string;
  backListener = '';
  isBackPressSubscribed = false;

  innerWidth: any;
  mobileThreshold = 567;
  isNavbarCollapsed = true;
  notifications: any;
  count: any;
  totoalNotification: any;
  isNotificationEnabled: boolean;

  isWillWritingEnabled = false;
  isInvestmentEnabled = true;
  isComprehensiveEnabled = true;

  @ViewChild('navbar') NavBar: ElementRef;
  @ViewChild('navbarDropshadow') NavBarDropShadow: ElementRef;
  constructor(
    private navbarService: NavbarService, private _location: Location,
    private config: NgbDropdownConfig, private renderer: Renderer2,
    private cdr: ChangeDetectorRef, private router: Router,
    private modal: NgbModal,
    private configService: ConfigService,
    private signUpService: SignUpService,
    public investmentAccountService: InvestmentAccountService) {
    config.autoClose = true;
    this.navbarService.getNavbarEvent.subscribe((data) => {
      this.navbarService.setNavbarDetails(this.NavBar);
    });

    this.configService.getConfig().subscribe((moduleConfig: IConfig) => {
      this.isWillWritingEnabled = moduleConfig.willWritingEnabled;
      this.isInvestmentEnabled = moduleConfig.investmentEnabled;
      this.isComprehensiveEnabled = moduleConfig.comprehensiveEnabled;
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
    this.innerWidth = window.innerWidth;
    this.navbarService.currentPageTitle.subscribe((title) => this.pageTitle = title);
    this.navbarService.currentPageSubTitle.subscribe((subTitle) => this.subTitle = subTitle);
    this.navbarService.currentPageHelpIcon.subscribe((helpIcon) => this.helpIcon = helpIcon);
    this.navbarService.currentPageProdInfoIcon.subscribe((closeIcon) => this.closeIcon = closeIcon);
    this.navbarService.currentPageSettingsIcon.subscribe((settingsIcon) => this.settingsIcon = settingsIcon);
    this.navbarService.currentPageFilterIcon.subscribe((filterIcon) => this.filterIcon = filterIcon);
    this.navbarService.isBackPressSubscribed.subscribe((subscribed) => {
      this.isBackPressSubscribed = subscribed;
      this.investmentAccountService.getAllNotifications().subscribe((response) => {
        console.log(response);
        this.notifications = response.objectList;
        this.count = this.notifications.length;
        this.totoalNotification = this.notifications.length;
        if ( this.count > 99) {
        this.count = '99+';
        }
        this.notifications.splice(3);
        console.log('After Splice ' + this.notifications);
        });
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
      if ( navbarMode !== 2) {
      this.isNotificationEnabled = this.canActivateNotification();
      } else {
        this.isNotificationEnabled = false;
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
  // tslint:disable-next-line:member-ordering
  IsHidden = true;
 onSelect() {
  this.IsHidden = !this.IsHidden;
}
viewAllNotifications() {
  this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.VIEW_ALL_NOTIFICATIONS]);
  this.IsHidden = true;
}
canActivateNotification() {
  const userInfo = this.signUpService.getUserProfileInfo();
  if (!(userInfo && userInfo.firstName)) {
    return false;
  }
  return true;
}
showFilterModalPopUp(data) {
  this.modalRef = this.modal.open(TransactionModalComponent, { centered: true });
}
}
