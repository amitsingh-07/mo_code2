import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin as observableForkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { environment } from './../../../environments/environment';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { RefereeComponent } from '../../shared/modal/referee/referee.component';

import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpService } from '../sign-up.service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.component.html',
  styleUrls: ['./refer-a-friend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferAFriendComponent implements OnInit {
  isCollapsed: boolean = false;
  pageTitle: string;
  facebookShareLink: any;
  whatsappShareLink: any;
  telegramShareLink: any;
  mailToLink: any;
  referrerLink: any;
  showFixedToastMessage: boolean;
  toastMsg: any;
  referralCode = '';
  referrerName: any;
  refereeTotalList = [];
  refereeList = [];
  totalRefereeListCount: number;
  pageLimit = 5;
  refereeExists = false;
  referrerExists = false;
  constructor(
    private router: Router,
    public navbarService: NavbarService,
    public modal: NgbModal,
    private translate: TranslateService,
    private signUpService: SignUpService,
    config: NgbDropdownConfig
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
    this.pageTitle = this.translate.instant('REFER_FRIEND.PAGE_TITLE_LBL');
    this.setPageTitle(this.pageTitle);
    config.placement = 'top-center';
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.signUpService.getRefereeList().subscribe((data) => {
      const responseMessage = data.responseMessage;
      if (responseMessage.responseCode === 6000) {
        if (data.objectList) {
          const referralData = data.objectList;
          this.referrerName = referralData.referrerName ? referralData.referrerName : '';
          this.referralCode = referralData.referralCode ? referralData.referralCode : '';
          this.refereeExists =  referralData.refereeExists;
          this.referrerExists = referralData.referrerExists;
          if (this.referralCode) {
            this.createReferrerLink();
            this.totalRefereeListCount = (referralData.totalRefereesCount > 0) ? referralData.totalRefereesCount : 0;
            if (this.totalRefereeListCount > 0 && referralData.refereeDetailsList) {
              this.refereeTotalList = referralData.refereeDetailsList;
              this.refereeList = this.refereeTotalList.slice(0, this.pageLimit);
            }
          }
        }
      }
    });
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
  }


  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }


  goToRewards() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  // create Referrer Link
  createReferrerLink() {
    const socialMessage = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MESSAGE');
    const socialMail1 = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MAIL_BODY1');
    const socialMail2 = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MAIL_BODY2');
    const socialMailSubject = encodeURIComponent(this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MAIL_SUBJECT'));
    this.referrerLink = environment.apiBaseUrl + SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.SIGN_UP_URL + this.referralCode;
    const socialMessageEncoded = encodeURIComponent(socialMessage + this.referrerLink);
    const fbMessage = socialMessageEncoded + '&u=' + encodeURIComponent(this.referrerLink);
    this.facebookShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.FACEBOOK + fbMessage;
    this.whatsappShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.WHATSAPP + socialMessageEncoded;
    this.telegramShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.TELEGRAM + socialMessageEncoded;
    const socialMailEncoded = encodeURIComponent(socialMail1 + this.referrerLink + socialMail2 + this.referrerName);
    this.mailToLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.MAILTO + socialMailEncoded + '&subject=' + socialMailSubject;
  }

  openRefereeModal() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.REFER_REDIRECT+'/refer-a-friend'],{ skipLocationChange: true });
  }

  notify(event) {
    const toasterMsg = {
      desc: this.translate.instant('SOCIAL_LINK_MESSAGE.COPIED')
    };
    this.toastMsg = toasterMsg;
    this.showFixedToastMessage = true;
    this.hideToastMessage();
  }

  hideToastMessage() {
    setTimeout(() => {
      this.showFixedToastMessage = false;
      this.toastMsg = null;
    }, 3000);
  }

  toggleinfo(event) {
    this.isCollapsed = !this.isCollapsed;
  }
  getReferralLink() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('REFER_A_FRIEND.REFER_LINK_MODAL.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('REFER_A_FRIEND.REFER_LINK_MODAL.MESSAGE');
    ref.componentInstance.primaryActionLabel = this.translate.instant('REFER_A_FRIEND.REFER_LINK_MODAL.PRIMARY_ACTION_LBL');
    ref.componentInstance.primaryAction.subscribe(() => {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    });
  }

  getRefereeList() {
    if (this.totalRefereeListCount > this.refereeList.length) {
      this.refereeList = this.refereeTotalList.slice(0, (this.pageLimit + this.refereeList.length));
    }
  }
}
