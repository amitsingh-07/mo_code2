import { Location } from '@angular/common';
import { ElementRef, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { filter } from 'rxjs/operators';

import { IHeaderMenuItem } from './navbar.types';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  isBackPressSubscribed = new BehaviorSubject(false);

  private navbar = new Subject(); // The navbar itself
  private getNavEvent = new BehaviorSubject(true);
  private navbarMode = new BehaviorSubject(1);
  private navbarVisibility = new BehaviorSubject(true);
  private navbarMobileVisibility = new BehaviorSubject(true);
  private navbarShadowVisibility = new BehaviorSubject(true);
  private backListener = new BehaviorSubject('');

  existingNavbar = this.navbar.asObservable();
  getNavbarEvent = this.getNavEvent.asObservable();
  currentNavbarMode = this.navbarMode.asObservable();
  currentNavbarVisibility = this.navbarVisibility.asObservable();
  currentNavbarMobileVisibility = this.navbarMobileVisibility.asObservable();
  currentNavbarShadowVisibility = this.navbarShadowVisibility.asObservable();
  currentBackListener = this.backListener.asObservable();

  /* Header Params */
  private pageTitle = new BehaviorSubject('');
  private pageSubTitle = new BehaviorSubject('');
  private pageHelpIcon = new BehaviorSubject(false);
  private pageProdInfoIcon = new BehaviorSubject(false);
  private pageClearNotify = new BehaviorSubject(false);

  private investPageTitle = new BehaviorSubject('');
  private investPageSuperTitle = new BehaviorSubject('');

  private mobileModal = new BehaviorSubject('');
  private clearNotificationEvent = new BehaviorSubject(false);
  private closeProdInfo = new BehaviorSubject('');
  private pageSettingsIcon = new BehaviorSubject(true);
  private pageFilterIcon = new BehaviorSubject(true);
  private pageSuperTitle = new BehaviorSubject('');
  private menuItem = new BehaviorSubject({} as IHeaderMenuItem);
  private $menuItemClick = new BehaviorSubject('');

  currentPageTitle = this.pageTitle.asObservable();
  currentPageSubTitle = this.pageSubTitle.asObservable();
  currentPageHelpIcon = this.pageHelpIcon.asObservable();
  currentPageProdInfoIcon = this.pageProdInfoIcon.asObservable();
  currentMobileModalEvent = this.mobileModal.asObservable();
  currentPageClearNotify = this.pageClearNotify.asObservable();
  currentClearNotificationEvent = this.clearNotificationEvent.asObservable();

  currentPageSettingsIcon = this.pageSettingsIcon.asObservable();
  currentPageFilterIcon = this.pageFilterIcon.asObservable();
  currentPageSuperTitle = this.pageSuperTitle.asObservable();
  currentMenuItem = this.menuItem.asObservable();

  onMenuItemClicked = this.$menuItemClick.asObservable();
  investmentPageTitle = this.investPageTitle.asObservable();
  investmentPageSuperTitle = this.investPageSuperTitle.asObservable();

  constructor(private router: Router, private _location: Location) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      this.unsubscribeBackPress();
    });
  }

  /* Navbar Generic Element Details*/
  setNavbarDetails(navbar: ElementRef) {
    this.navbar.next(navbar);
  }

  getNavbarDetails() {
    this.getNavEvent.next(true);
  }

  setNavbarComprehensive(secondaryVisible: boolean) {
    this.setNavbarVisibility(true);
    this.setNavbarMode(7);
    this.setNavbarMobileVisibility(secondaryVisible);
    this.setNavbarShadowVisibility(false);
  }

  /* Visibility Functions */
  // tslint:disable-next-line:no-identical-functions
  setNavbarDirectGuided(secondaryVisible: boolean) {
    this.setNavbarVisibility(true);
    this.setNavbarMode(2);
    this.setNavbarMobileVisibility(secondaryVisible);
    this.setNavbarShadowVisibility(false);
  }

  setNavbarWillWriting() {
    this.setNavbarVisibility(true);
    this.setNavbarMode(2);
    this.setNavbarMobileVisibility(false);
    this.setNavbarShadowVisibility(false);
  }

  setNavbarVisibility(isVisible: boolean) {
    this.navbarVisibility.next(isVisible);
  }

  setNavbarMobileVisibility(isVisible: boolean) {
    this.navbarMobileVisibility.next(isVisible);
  }
  // Shadow Visibility
  setNavbarShadowVisibility(isVisible: boolean) {
    this.navbarShadowVisibility.next(isVisible);
  }

  /* Header Mode*/
  setNavbarMode(mode: number) {
    this.navbarMode.next(mode);
  }

  setProdButtonVisibility(isVisible: boolean) {
    this.pageProdInfoIcon.next(isVisible);
  }

  setPageTitleWithIcon(title: string, menuItem: IHeaderMenuItem) {
    this.pageTitle.next(title);
    this.menuItem.next(menuItem);
    this.pageHelpIcon.next(false);
    this.pageSettingsIcon.next(false);
    this.pageFilterIcon.next(false);
  }
  setClearAllNotify(isVisible: boolean) {
    this.pageClearNotify.next(isVisible);
  }

  setInvestPageTitle(title: string, superTitle?: string) {
    this.investPageTitle.next(title);
    this.investPageSuperTitle.next(superTitle);
  }

  /* Header Functions*/
  // Setting Page Title
  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean, settingsIcon?: boolean, filterIcon?: boolean, superTitle?: string) {
    this.setInvestPageTitle(title, superTitle ? superTitle : ''); //Investment - Desktop/Tablet page tile
    this.pageTitle.next(title);
    if (subTitle) {
      this.pageSubTitle.next(subTitle);
    } else {
      this.pageSubTitle.next('');
    }
    if (helpIcon) {
      this.pageHelpIcon.next(true);
    } else {
      this.pageHelpIcon.next(false);
    }
    if (settingsIcon) {
      this.pageSettingsIcon.next(true);
    } else {
      this.pageSettingsIcon.next(false);
    }
    if (filterIcon) {
      this.pageFilterIcon.next(true);
    } else {
      this.pageFilterIcon.next(false);
    }
    if (superTitle) {
      this.pageSuperTitle.next(superTitle);
    } else {
      this.pageSuperTitle.next('');
    }

    // Reset/Hide menuItem
    this.menuItem.next({} as IHeaderMenuItem);
  }
  // Showing Mobile PopUp Trigger
  showMobilePopUp(event) {
    this.mobileModal.next(event);
  }

  menuItemClicked(pageId) {
    this.$menuItemClick.next(pageId);
  }

  // Hiding Product Info Modal Trigger
  backPressed(pageTitle: string) {
    this.backListener.next(pageTitle);
  }

  goBack() {
    this._location.back();
  }

  // Clearing Notification
  clearNotification() {
    this.clearNotificationEvent.next(true);
  }

  subscribeBackPress() {
    this.isBackPressSubscribed.next(true);
    return this.currentBackListener;
  }

  unsubscribeBackPress() {
    this.isBackPressSubscribed.next(false);
    this.backListener.next('');
  }

  unsubscribeMenuItemClick() {
    this.menuItem.next(null);
    this.$menuItemClick.next('');
  }
}


