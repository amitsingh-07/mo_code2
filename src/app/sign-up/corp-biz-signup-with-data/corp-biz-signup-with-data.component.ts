import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../../app.service';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-corp-biz-signup-with-data',
  templateUrl: './corp-biz-signup-with-data.component.html',
  styleUrls: ['./corp-biz-signup-with-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CorpBizSignupWithDataComponent implements OnInit {

  corpBizMyInfoData: any;
  corpBizUserData: any
  constructor(
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    private signUpService: SignUpService,
    private appService: AppService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
    this.corpBizMyInfoData = {"fullName":"AMINA ABDUL RAHMAN","nricNumber":"M3456768Q","email":"myinfotesting@gmail.com","mobileNumber":"96499899","dob":{"year":1983,"month":3,"day":26},"gender":"female","isMyInfoEnabled":true,"disableAttributes":["fullName","nricNumber","dob","gender","fullName","nricNumber","dob","gender"]};
    // this.corpBizMyInfoData = signUpService.getAccountInfo();
    this.corpBizUserData = appService.getCorpBizData();
  }

  ngOnInit(): void {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }

  goToNext() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.CORP_BIZ_CREATE_ACC]);
  }
}
