import {
  AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewEncapsulation, ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { appConstants } from '../../../app.constants';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { AppService } from './../../../app.service';
import { AuthenticationService } from './../../../shared/http/auth/authentication.service';
import { InvestmentCommonService } from './../../investment-common/investment-common.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { INVESTMENT_COMMON_CONSTANTS } from '../../investment-common/investment-common.constants';
@Component({
  selector: 'app-wise-income-payout',
  templateUrl: './wise-income-payout.component.html',
  styleUrls: ['./wise-income-payout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WiseIncomePayoutComponent implements OnInit {
  pageTitle: string;
  wiseIncomePayOutTypeForm: FormGroup;
  formBuilder: any;
  wiseIncomePayOutTypes;
  formValues;
  loaderTitle: string;
  loaderDesc: string;
  wiseIncomePayOutType;
  portfolioType;
  selectedPortfolioType;
  initialWiseIncomePayoutTypeId;
  activeTabId = 1;
  fundingMethods: any;
  payoutFundList: any;
  defaultPayoutypeEnabled: boolean;
  queryParams;

  @ViewChild('payoutOption') payoutOptionElement: ElementRef;
  @ViewChild('featureBenefits') featureBenefitsElement: ElementRef;
  @ViewChild('fundAssets') fundAssetsElement: ElementRef;

  constructor(
    public readonly translate: TranslateService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
    public headerService: HeaderService,
    public authService: AuthenticationService,
    private investmentCommonService: InvestmentCommonService,
    private appService: AppService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private loaderService: LoaderService,
    private investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WISE_INCOME_PAYOUT.TITLE');
      this.setPageTitle(this.pageTitle, null, null, false, false, null, true);
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getWiseIncomePayOutDetails();
    this.getOptionListCollection();
    this.queryParams = this.route.snapshot.queryParams;
    if (this.queryParams && this.queryParams.key && this.queryParams.key === 'wise-income') {
      this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
      this.investmentEngagementJourneyService.setSelectPortfolioType({ selectPortfolioType: 'wiseIncomePortfolio' });
    }
    this.investmentAccountService.getSpecificDropList('portfolioType').subscribe((data) => {
      this.investmentCommonService.setPortfolioType(data.objectList.portfolioType);
      this.selectedPortfolioType = this.investmentEngagementJourneyService.getSelectPortfolioType()
      let portfolioTypeArray = this.investmentCommonService.getPortfolioType();
      let portfolioType = this.investmentEngagementJourneyService.filterDataByInput(portfolioTypeArray.portfolioType, 'name', INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME);
      this.getFundListMethod(portfolioType.id);
    });
    this.formValues = this.investmentCommonService.getWiseIncomePayOut();
    this.activeTabId = this.formValues.activeTabId ? this.formValues.activeTabId : 1;

    this.navbarService.scrollToObserv.subscribe((elementName: any) => {
      if (elementName == 'payoutOption') {
        this.goToSection(this.payoutOptionElement.nativeElement);
      } else if (elementName == 'featureBenefits') {
        this.goToSection(this.featureBenefitsElement.nativeElement);
      } else if (elementName == 'fundAssets') {
        this.goToSection(this.fundAssetsElement.nativeElement);
      } else if (elementName == 'backToTop') {
        window.scrollTo(0, 0);
      }
    });
  }

  buildForm() {
    this.activeTabId = this.formValues.activeTabId ? this.formValues.activeTabId : 1;
    this.wiseIncomePayOutTypeForm = new FormGroup({
      initialWiseIncomePayoutTypeId: new FormControl(
        this.formValues.initialWiseIncomePayoutTypeId ? this.formValues.initialWiseIncomePayoutTypeId :
          this.getdefaultWiseIcomePayoutTypeNameById(INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.DEFAULT_PAYOUT.GROW, this.wiseIncomePayOutTypes), Validators.required)
    });
    if (
      this.defaultPayoutypeEnabled = this.getdefaultWiseIcomePayoutTypeNameById(INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.DEFAULT_PAYOUT.GROW, this.wiseIncomePayOutTypes)) {
      this.defaultPayoutypeEnabled = true;
    }
    else {
      this.defaultPayoutypeEnabled = false;
    }
  }

  getFundListMethod(portfolioTypeId) {
    this.investmentEngagementJourneyService.getFundListMethod(portfolioTypeId).subscribe((data) => {
      this.payoutFundList = {
        'GROW': data.objectList[INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PAYOUT_FUNDLIST.GROW],
        'FOUR_PERCENT': data.objectList[INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PAYOUT_FUNDLIST.FOUR_PERCENT],
        'EIGHT_PERCENT': data.objectList[INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PAYOUT_FUNDLIST.EIGHT_PERCENT]
      };
    });
  }
  getWiseIncomePayOutDetails() {
    this.loaderService.showLoader({
      title: this.loaderTitle,
      desc: this.loaderDesc
    });
    this.investmentAccountService.getSpecificDropList('wiseIncomePayoutType').subscribe((data) => {
      this.loaderService.hideLoader();
      this.wiseIncomePayOutTypes = data.objectList.wiseIncomePayoutType;
      this.buildForm();
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean, settingsIcon?: boolean, filterIcon?: boolean, superTitle?: string, dropDownIcon?: boolean) {
    this.navbarService.setPageTitle(title, null, null, false, false, null, dropDownIcon);
  }
  getWiseIcomePayoutTypeNameById(wiseIncomePayoutTypeId, payoutOptions) {
    if (wiseIncomePayoutTypeId && payoutOptions) {
      const wiseIncomePayoutType = payoutOptions.filter(
        (prop) => prop.id === wiseIncomePayoutTypeId
      );
      return wiseIncomePayoutType[0].name;
    } else {
      return '';
    }
  }
  getOptionListCollection() {
    this.loaderService.showLoader({
      title: this.loaderTitle,
      desc: this.loaderDesc
    });
    this.investmentAccountService.getSpecificDropList('portfolioFundingMethod').subscribe((data) => {
      this.loaderService.hideLoader();
      this.fundingMethods = data.objectList.portfolioFundingMethod;
      this.investmentEngagementJourneyService.sortByProperty(this.fundingMethods, 'name', 'asc');

    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  getFundingMethodNameByName(fundingMethodName, fundingOptions) {
    if (fundingMethodName && fundingOptions) {
      const fundingMethod = fundingOptions.filter(
        (prop) => prop.name.toUpperCase() === fundingMethodName.toUpperCase()
      );
      return fundingMethod[0].id;
    } else {
      return '';
    }
  }
  getPayoutMethodNameById(fundingMethodId, wiseIncomePayOutOptions) {
    if (fundingMethodId && wiseIncomePayOutOptions) {
      const fundingMethod = wiseIncomePayOutOptions.filter(
        (prop) => prop.id === fundingMethodId
      );
      return fundingMethod[0].key
    } else {
      return '';
    }
  }
  getdefaultWiseIcomePayoutTypeNameById(wiseIncomePayoutTypeId, payoutOptions) {
    if (wiseIncomePayoutTypeId && payoutOptions) {
      const wiseIncomePayoutType = payoutOptions.filter(
        (prop) => prop.key === wiseIncomePayoutTypeId
      );
      return wiseIncomePayoutType[0].id;
    }
  }
  goToNext(form) {
    this.investmentCommonService.setWiseIncomePayOut(form.value, this.activeTabId);
    const payoutKey = this.getPayoutMethodNameById(form.value.initialWiseIncomePayoutTypeId, this.wiseIncomePayOutTypes);
    if (payoutKey === INVESTMENT_COMMON_CONSTANTS.WISE_INCOME_PAYOUT.GROW) {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.FUNDING_METHOD]);
    } else {
      const fundingMethod = this.getFundingMethodNameByName(INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS.CASH, this.fundingMethods);
      this.investmentCommonService.setInitialFundingMethod({ initialFundingMethodId: fundingMethod });
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
    }
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeDropDownIcon();
  }

  goToSection(elementName) {
    elementName.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
  }
}
