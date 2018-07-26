import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private pageTitle = new BehaviorSubject('');
  private pageSubTitle = new BehaviorSubject('');
  private pageHelpIcon = new Subject<boolean>();
  private mobileModal = new BehaviorSubject(event);

  currentPageTitle = this.pageTitle.asObservable();
  currentPageSubTitle = this.pageSubTitle.asObservable();
  currentPageHelpIcon = this.pageHelpIcon.asObservable();
  currentMobileModalEvent = this.mobileModal.asObservable();

  constructor() { }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
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
  }
  showMobilePopUp() {
    console.log('Show Mobile Pop-up');
  }
}
