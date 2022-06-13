import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-corp-biz-activation-link',
  templateUrl: './corp-biz-activation-link.component.html',
  styleUrls: ['./corp-biz-activation-link.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorpBizActivationLinkComponent implements OnInit {
  screenToShow: string;
  queryParams: Params;
  token: string;
  screenConstants = SIGN_UP_CONFIG.CORP_BIZ_ACTIVATIONLINK;

  constructor(
    private router: Router,
    public footerService: FooterService,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private signUpApiService: SignUpApiService,
    private appService: AppService
  ) {
    this.translate.use('en');
    this.authService.clearSession();
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.queryParams = this.route.snapshot.queryParams;
    this.token = encodeURIComponent(this.queryParams.confirmation_token);
    this.authService.authenticate().subscribe(() => {
      this.signUpApiService.checkCorporateEmailValidity({ token: `${this.token}` }).subscribe((data) => {
        if (data.responseMessage.responseCode === 6000) {
          const corpBizData = {
            isCorpBiz: true,
            email: data.objectList && data.objectList.length ? data.objectList[0].email : null,
            mobile: data.objectList && data.objectList.length ? data.objectList[0].maskedMobileNumber : null,
            enrollmentId: data.objectList && data.objectList.length ? data.objectList[0].enrolmentId : null
          }
          this.appService.setCorpBizData(corpBizData);
          this.router.navigate([SIGN_UP_ROUTE_PATHS.CORP_BIZ_SIGNUP]);
        } else if (data.responseMessage.responseCode === 5022) {
          this.screenToShow = SIGN_UP_CONFIG.CORP_BIZ_ACTIVATIONLINK.LINK_EXPIRED;
        } else if (data.responseMessage.responseCode === 5033) {
          this.screenToShow = SIGN_UP_CONFIG.CORP_BIZ_ACTIVATIONLINK.INVALID_USER;
        } else if (data.responseMessage.responseCode === 6008) {
          this.screenToShow = SIGN_UP_CONFIG.CORP_BIZ_ACTIVATIONLINK.ACC_EXIST;
        } else {
          this.router.navigate(['/page-not-found']);
        }
       // redirect to home page after 10 seconds if activation link not valid
        if(this.screenToShow) {
          setTimeout(() => {
            window.location.replace("./home");
          }, 10000);
        }
      }, err => {
        this.router.navigate(['/page-not-found']);
      });
    });
  }

}

