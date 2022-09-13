import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Child, CPFBalances, CPFWithdrawal, Noa } from '../../sign-up/sign-up-form-data';
import { SignUpService } from '../../sign-up/sign-up.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { ComprehensiveService } from '../comprehensive.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Component({
  selector: 'app-autofill-myinfo-data',
  templateUrl: './autofill-myinfo-data.component.html',
  styleUrls: ['./autofill-myinfo-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AutofillMyinfoDataComponent implements OnInit {

  cfpAutoFillMyinfoData: any;

  noaData: Noa;
  childrenRecords: Child[];
  sponsoredChildrenRecords: Child[];
  cpfHousingWihdrawal: CPFWithdrawal[];
  hdbProperty = [];
  vehicles = [];
  cpfBalances: CPFBalances;
  isVehicleData = true;
  isCPFHousingWithdrawal = true;
  taxClearanceConsts = COMPREHENSIVE_CONST.TAX_CLEARANCE;

  myInfoAttriutes: any;

  saveData: string;

  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private readonly translate: TranslateService,
    private signUpService: SignUpService,
    private myInfoService: MyInfoService,
    private comprehensiveApiService: ComprehensiveApiService,
    private comprehensiveService: ComprehensiveService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.saveData = this.translate.instant('COMMON_LOADER.SAVE_DATA');
    });
    this.myInfoAttriutes = myInfoService.getMyInfoAttributes();
    this.isVehicleData = this.myInfoAttriutes.includes(COMPREHENSIVE_CONST.EXCLUDABLE_CORP_BIZ_MY_INFO_ATTRIBUTES.VEHICLES);
    this.isCPFHousingWithdrawal = this.myInfoAttriutes.includes(COMPREHENSIVE_CONST.EXCLUDABLE_CORP_BIZ_MY_INFO_ATTRIBUTES.CPF_HOUSING_WITHDRAWAL);

    this.cfpAutoFillMyinfoData = signUpService.getCorpBizUserMyInfoData();

    this.noaData = this.cfpAutoFillMyinfoData && this.cfpAutoFillMyinfoData.noa ? this.cfpAutoFillMyinfoData.noa : null;
    this.childrenRecords = this.cfpAutoFillMyinfoData && this.cfpAutoFillMyinfoData.childrenRecords && this.cfpAutoFillMyinfoData.childrenRecords.length > 0 ? this.cfpAutoFillMyinfoData.childrenRecords : [];
    this.sponsoredChildrenRecords = this.cfpAutoFillMyinfoData && this.cfpAutoFillMyinfoData.sponsoredChildrenRecords && this.cfpAutoFillMyinfoData.sponsoredChildrenRecords.length >= 0 ? this.cfpAutoFillMyinfoData.sponsoredChildrenRecords : [];
    this.cpfHousingWihdrawal = this.cfpAutoFillMyinfoData && this.cfpAutoFillMyinfoData.cpfhousingwithdrawal && this.cfpAutoFillMyinfoData.cpfhousingwithdrawal.length > 0 ? this.cfpAutoFillMyinfoData.cpfhousingwithdrawal : [];
    this.hdbProperty = this.cfpAutoFillMyinfoData.hdbProperty;
    this.vehicles = this.cfpAutoFillMyinfoData.vehicles;
    this.cpfBalances = this.cfpAutoFillMyinfoData.cpfBalances
  }

  ngOnInit(): void {
    this.navbarService.setNavbarComprehensive(true);
  }

  goToNext() {
    this.loaderService.showLoader({ title: this.saveData });
    this.comprehensiveApiService.getComprehensiveAutoFillCFPData().subscribe((compreData) => {
      if (compreData && compreData.objectList[0]) {
        this.comprehensiveService.setComprehensiveSummary(compreData.objectList[0]);
        this.loaderService.hideLoaderForced();
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
      } else {
        this.loaderService.hideLoaderForced();
      }
    }, err => {
      this.loaderService.hideLoaderForced();
    })
  }
}
