import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    private pageTitle = new BehaviorSubject('');
    private pageSubTitle = new BehaviorSubject('');
    private pageHelpIcon = new BehaviorSubject(true);
    private pageProdInfoIcon = new BehaviorSubject(false);
    private mobileModal = new BehaviorSubject('');
    private closeProdInfo = new BehaviorSubject('');
    private headerOverallVisibility = new BehaviorSubject(true);
    private headerVisibility = new BehaviorSubject(true);
    private headerDropshadow = new BehaviorSubject(true);
    private pageSettingsIcon = new BehaviorSubject(true);

    currentPageTitle = this.pageTitle.asObservable();
    currentPageSubTitle = this.pageSubTitle.asObservable();
    currentPageHelpIcon = this.pageHelpIcon.asObservable();
    currentPageProdInfoIcon = this.pageProdInfoIcon.asObservable();
    currentMobileModalEvent = this.mobileModal.asObservable();
    currentHeaderOverallVisibility = this.headerOverallVisibility.asObservable();
    currentHeaderVisibility = this.headerVisibility.asObservable();
    currentHeaderDropshadow = this.headerDropshadow.asObservable();
    currentPageSettingsIcon = this.pageSettingsIcon.asObservable();

    constructor() { }

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

        this.headerVisibility.next(true);
    }
    // Initiate Buttons

    setProdButtonVisibility(isVisible: boolean) {
        this.pageProdInfoIcon.next(isVisible);
    }

    setHeaderVisibility(isVisible: boolean) {
        this.headerVisibility.next(isVisible);
    }

    setHeaderOverallVisibility(isVisible: boolean) {
        this.headerOverallVisibility.next(isVisible);
        console.log('Header Overall Visibility' + isVisible);
    }

    setHeaderDropshadowVisibility(isVisible: boolean) {
        this.headerDropshadow.next(isVisible);
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
