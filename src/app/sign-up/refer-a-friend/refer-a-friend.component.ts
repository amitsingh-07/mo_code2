import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from './../../../environments/environment';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS} from '../../sign-up/sign-up.routes.constants';
import { RefereeComponent } from '../../shared/modal/referee/referee.component';

@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.component.html',
  styleUrls: ['./refer-a-friend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferAFriendComponent implements OnInit {
  isCollapsed = false;

  facebookShareLink: any;
  whatsappShareLink: any;
  telegramShareLink: any;
  mailToLink: any;
  referrerLink: any;
  showFixedToastMessage: boolean;
  toastMsg: any;
  referralCode = '';

  constructor(private router: Router, public modal: NgbModal, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
    
   }

  ngOnInit(): void {
    this.referralCode = 'KELV-TA23';
    this.createReferrerLink();
  }
 
  goToRewards(){
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  // create Referrer Link
  createReferrerLink() {   
    const socialMessage = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MESSAGE');
    const socialMail1 = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MAIL1');
    const socialMail2 = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MAIL2');
    this.referrerLink = environment.apiBaseUrl + SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.SIGN_UP_URL + this.referralCode;
    const socialMessageEncoded = encodeURIComponent(socialMessage + this.referrerLink);   
    const fbMessage = socialMessageEncoded + '&u=' + encodeURIComponent(this.referrerLink);
    this.facebookShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.FACEBOOK + fbMessage;
    this.whatsappShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.WHATSAPP + socialMessageEncoded;
    this.telegramShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.TELEGRAM + socialMessageEncoded;
    const socialMailEncoded = encodeURIComponent(socialMail1 + this.referrerLink + socialMail2 + 'ReferrerName');   
    this.mailToLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.MAILTO + socialMailEncoded;
  }

  openRefereeModal(){
    const ref = this.modal.open(RefereeComponent, { centered: true });
    ref.componentInstance.errorTitle = "referee";
    ref.componentInstance.errorMessage = 'Welcome to the referee.';
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
}
