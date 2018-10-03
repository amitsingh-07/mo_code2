import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private navbar = new Subject(); // The navbar itself
  private navbarMode = new BehaviorSubject(1);
  private navbarVisibility = new BehaviorSubject(true);
  private navbarMobileVisibility = new BehaviorSubject(true);
  private navbarShadowVisibility = new BehaviorSubject(true);

  existingNavbar = this.navbar.asObservable();
  currentNavbarMode = this.navbarMode.asObservable();
  currentNavbarVisibility = this.navbarVisibility.asObservable();
  currentNavbarMobileVisibility = this.navbarMobileVisibility.asObservable();
  currentNavbarShadowVisibility = this.navbarShadowVisibility.asObservable();

  /* Header Params */
  private pageTitle = new BehaviorSubject('');
  private pageSubTitle = new BehaviorSubject('');
  private pageHelpIcon = new BehaviorSubject(true);
  private pageProdInfoIcon = new BehaviorSubject(false);

  private mobileModal = new BehaviorSubject('');
  private closeProdInfo = new BehaviorSubject('');
  private pageSettingsIcon = new BehaviorSubject(true);

  currentPageTitle = this.pageTitle.asObservable();
  currentPageSubTitle = this.pageSubTitle.asObservable();
  currentPageHelpIcon = this.pageHelpIcon.asObservable();
  currentPageProdInfoIcon = this.pageProdInfoIcon.asObservable();
  currentMobileModalEvent = this.mobileModal.asObservable();
  currentPageSettingsIcon = this.pageSettingsIcon.asObservable();

  constructor() {}

  /* Navbar Generic Element Details*/
  getNavbarDetails(navbar: ElementRef) {
    this.navbar.next(navbar);
    }
  /* Visibility Functions */
  setNavbarDirectGuided(secondaryVisible: boolean) {
    this.setNavbarVisibility(true);
    this.setNavbarMode(2);
    this.setNavbarMobileVisibility(secondaryVisible);
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

  /* Header Functions*/
  // Setting Page Title
  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean, settingsIcon?: boolean) {
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
    }
  // Showing Mobile PopUp Trigger
  showMobilePopUp(event) {
    this.mobileModal.next(event);
  }

  // Hiding Product Info Modal Trigger
  hideProdInfo(event) {
    this.closeProdInfo.next(event);
  }

}
