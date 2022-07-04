import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../../app.service';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { Child, CPFBalances, CPFWithdrawal, Noa } from '../sign-up-form-data';

@Component({
  selector: 'app-corp-biz-signup-with-data',
  templateUrl: './corp-biz-signup-with-data.component.html',
  styleUrls: ['./corp-biz-signup-with-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CorpBizSignupWithDataComponent implements OnInit {

  corpBizMyInfoPersonalData: any;
  corpBizMyInfoData: any;
  corpBizUserData: any;
  noaData: Noa;
  childrenRecords: Child[];
  sponsoredChildrenRecords: Child[];
  cpfHousingWihdrawal: CPFWithdrawal[];
  hdbProperty = [];
  vehicles = [];
  cpfBalances: CPFBalances;
  taxClearanceConsts = SIGN_UP_CONFIG.TAX_CLEARANCE;
  constructor(
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    private _location: Location,
    private signUpService: SignUpService,
    private appService: AppService,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
    this.corpBizMyInfoPersonalData = signUpService.getAccountInfo();
    this.corpBizMyInfoData = signUpService.getCorpBizUserMyInfoData();
    this.noaData = this.corpBizMyInfoData && this.corpBizMyInfoData.noa ? this.corpBizMyInfoData.noa : null;
    this.childrenRecords = this.corpBizMyInfoData && this.corpBizMyInfoData.childrenRecords && this.corpBizMyInfoData.childrenRecords.length > 0 ? this.corpBizMyInfoData.childrenRecords : [];
    this.sponsoredChildrenRecords = this.corpBizMyInfoData && this.corpBizMyInfoData.sponsoredChildrenRecords && this.corpBizMyInfoData.sponsoredChildrenRecords.length >= 0 ? this.corpBizMyInfoData.sponsoredChildrenRecords : [];
    this.cpfHousingWihdrawal = this.corpBizMyInfoData && this.corpBizMyInfoData.cpfhousingwithdrawal && this.corpBizMyInfoData.cpfhousingwithdrawal.length > 0 ? this.corpBizMyInfoData.cpfhousingwithdrawal : [];
    this.hdbProperty = this.corpBizMyInfoData.hdbProperty;
    this.vehicles = this.corpBizMyInfoData.vehicles;
    this.cpfBalances = this.corpBizMyInfoData.cpfBalances
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

  goBack() {
    this._location.back();
  }
}
