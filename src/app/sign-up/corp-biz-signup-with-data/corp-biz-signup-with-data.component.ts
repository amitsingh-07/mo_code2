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
    // this.corpBizMyInfoData = {"fullName":"TAN XIAO HUI","nricNumber":"ffda2bbc-9e0e-1eaf-2772-f88164ea2dd8","email":"myinfotesting@gmail.com","mobileNumber":"97399245","dob":{"year":1998,"month":6,"day":6},"gender":"female","birthCountry":{"id":225,"countryCode":"SG","name":"SINGAPORE","phoneCode":"+65","countryBlocked":false,"visible":true},"residentialstatus":"Citizen","noa":{"assessableIncome":64400,"trade":0,"interest":0,"yearOfAssessment":"2021","employment":64400,"rent":0,"taxClearance":"N","type":"ORIGINAL"},"cpfhousingwithdrawal":[{"withdrawalAmount":297500,"installmentAmount":1150,"acruedInterest":17500,"totalCPFAmount":700000}],"childrenRecords":[{"name":"TAN YEE TENG","gender":"female","lifeStatus":null,"dob":"13/4/2018","residentialStatus":null}],"sponsoredChildrenRecords":[{"name":"LIM YONG JIN","gender":"male","lifeStatus":null,"dob":"5/5/2018","residentialStatus":{"value":"P","classification":null,"source":null,"lastupdated":null,"desc":"PR"}}],"cpfBalances":{"ma":20466,"sa":15349.5,"oa":58839.75,"ra":null},"regadd":"BLK 102 PEARL GARDEN 09-128 BEDOK NORTH AVENUE 4 S(460102)","race":null,"hdbProperty":[{"dateOfPurchase":"21/4/2017","monthlyLoanInstalment":1800,"outstandingLoanBalance":435600,"loanGranted":400000,"leaseCommenceDate":null},{"dateOfPurchase":"5/1/1980","monthlyLoanInstalment":0,"outstandingLoanBalance":0,"loanGranted":0,"leaseCommenceDate":null}],"isMyInfoEnabled":true,"disableAttributes":["fullName","nricNumber","dob","gender"]};
    this.corpBizMyInfoData = signUpService.getAccountInfo();
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
