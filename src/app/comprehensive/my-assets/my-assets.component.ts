import { AboutAge } from './../../shared/utils/about-age.util';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyAssets } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { Util } from './../../shared/utils/util';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { SIGN_UP_ROUTE_PATHS } from './../../sign-up/sign-up.routes.constants';


@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
})
export class MyAssetsComponent implements OnInit, OnDestroy {
  RSPForm: any;
  pageTitle: string;
  myAssetsForm: FormGroup;
  myInvestmentProperties = true;
  investmentTypeList: any;
  investType = [];
  totalAssets = 0;
  assetDetails: IMyAssets;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  pageId: string;
  submitted: boolean;
  bucketImage: string;
  validationFlag: boolean;
  patternValidator = '^0*[1-9]\\d*$';
  myInfoSubscription: any;
  modelTitle: string;
  modelMessage: string;
  modelBtnText: string;
  showConfirmation: boolean;
  cpfFromMyInfo = false;
  viewMode: boolean;
  myinfoChangeListener: Subscription;
  showRetirementAccount: boolean = false;
  myAge: any;
  comprehensiveJourneyMode;
  saveData: string;
  schemeTypeList: any;
  schemeType = '';
  getAge: number;
  frsConfig = '';
  brsConfig = '';
  fundTypeList: any;
  fundTypeLite: any;
  errorMessageLite: any;
  fundType = [];
  showEditIcon:boolean = false;

  // tslint:disable-next-line:cognitive-complexity
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private progressService: ProgressTrackerService, private loaderService: LoaderService, private myInfoService: MyInfoService,
    private modal: NgbModal, private parserFormatter: NgbDateParserFormatter, private aboutAge: AboutAge) {
    this.pageId = this.route.routeConfig.component.name;
    this.viewMode = this.comprehensiveService.getViewableMode();
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and

        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
        this.investmentTypeList = this.translate.instant('CMP.MY_ASSETS.INVESTMENT_TYPE_LIST');
        this.setPageTitle(this.pageTitle);
        this.validationFlag = this.translate.instant('CMP.MY_ASSETS.OPTIONAL_VALIDATION_FLAG');
        this.saveData = this.translate.instant('COMMON_LOADER.SAVE_DATA');
        this.schemeTypeList = this.translate.instant('CMP.MY_ASSETS.SCHEME_TYPE_LIST');        
        this.fundTypeList = this.translate.instant('CMP.FUND_TYPE_LIST');  
        this.fundTypeLite = this.translate.instant('CMP.RSP.FUND_TYPE_LITE');        
        this.errorMessageLite = this.translate.instant('CMP.RSP.LITE_RSP_ERROR');
      });
    });
    const today: Date = new Date();
    this.myAge = this.comprehensiveService.getMyProfile().dateOfBirth;
    this.getAge = this.aboutAge.calculateAge(this.myAge, today);
    if (this.getAge > COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.RETIREMENT_AGE) {
      this.showRetirementAccount = true;
      const retirementSumConfigValue = this.comprehensiveService.retirementSumFindByBirthDate(this.myAge);
      this.brsConfig = (retirementSumConfigValue && retirementSumConfigValue['BRS']) ? retirementSumConfigValue['BRS'] : '';
      this.frsConfig = (retirementSumConfigValue && retirementSumConfigValue['FRS']) ? retirementSumConfigValue['FRS'] : '';
    }
    
    this.myinfoChangeListener = this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '') {
        if (myinfoObj.status && myinfoObj.status === 'SUCCESS' && this.myInfoService.isMyInfoEnabled
          && this.myInfoService.checkMyInfoSourcePage()) {
          this.myInfoService.getMyInfoData().subscribe((data) => {
            if (data && data['objectList'] && data['objectList'][0]['uin']) {
              this.comprehensiveService.validateUin(data['objectList'][0]['uin']).subscribe((response)=>{
                if (response.responseMessage['responseCode'] === 6013) {
                  const cpfValues = data.objectList[0].cpfbalances;
                  const oaFormControl = this.myAssetsForm.controls['cpfOrdinaryAccount'];
                  const saFormControl = this.myAssetsForm.controls['cpfSpecialAccount'];
                  const maFormControl = this.myAssetsForm.controls['cpfMediSaveAccount'];
                  const raFormControl = this.myAssetsForm.controls['cpfRetirementAccount'];
                  oaFormControl.setValue(cpfValues.oa);
                  saFormControl.setValue(cpfValues.sa);
                  maFormControl.setValue(cpfValues.ma);
                  const retirementAccount = this.showRetirementAccount ? cpfValues.ra : null;
                  raFormControl.setValue(retirementAccount);
                  saFormControl.markAsDirty();
                  maFormControl.markAsDirty();
                  raFormControl.markAsDirty();
                  this.onTotalAssetsBucket();
                  this.cpfFromMyInfo = true;
                  this.showEditIcon = true;
                  this.myInfoService.isMyInfoEnabled = false;
                  this.closeMyInfoPopup();
                } else {
                  this.openNricErrorModal();
                }
              }, (error) => {
                this.openNricErrorModal();
              });
            } else {
              this.closeMyInfoPopup();
            }
          }, (error) => {
            this.closeMyInfoPopup();
          });
        } else {
          this.myInfoService.isMyInfoEnabled = false;
          this.closeMyInfoPopup();
        }
      }
    });

    this.assetDetails = this.comprehensiveService.getMyAssets();
    this.comprehensiveJourneyMode = this.comprehensiveService.getComprehensiveVersion();
    if (!this.comprehensiveJourneyMode && this.assetDetails) {
      this.assetDetails.homeMarketValue = 0;
      this.assetDetails.otherAssetsValue = 0;
      this.assetDetails.investmentPropertiesValue = 0;
    }
    
    if (this.assetDetails && this.assetDetails.source === COMPREHENSIVE_CONST.CPF_SOURCE.MY_INFO) {
      this.cpfFromMyInfo = true;
      this.showEditIcon = true;
    }
    if (this.assetDetails && this.assetDetails.schemeType) {
      this.schemeType = this.assetDetails.schemeType;
    } else {
      this.schemeType = '';
    }
  }
  cancelMyInfo() {
    this.myInfoService.isMyInfoEnabled = false;
    this.myInfoService.closeMyInfoPopup(false);
    if (this.myInfoSubscription) {
      this.myInfoSubscription.unsubscribe();
    }
  }
  closeMyInfoPopup() {
    this.myInfoService.closeFetchPopup();
    this.myInfoService.changeListener.next('');
    if (this.myInfoService.isMyInfoEnabled) {
      this.myInfoService.isMyInfoEnabled = false;
      const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'my-info' });
      ref.componentInstance.errorTitle = this.translate.instant('MYINFO.ERROR_MODAL_DATA.TITLE');
      ref.componentInstance.errorMessage = this.translate.instant('MYINFO.ERROR_MODAL_DATA.DESCRIPTION');
      ref.componentInstance.isMyinfoError = true;
      ref.componentInstance.closeBtn = false;
      this.cpfFromMyInfo = false;
      ref.result.then(() => {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      }).catch((e) => {
      });
    }
  }

  openModal() {
    if (!this.viewMode) {
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'retrieve-myinfo-modal'});
      ref.componentInstance.lockIcon = true;
      ref.componentInstance.errorTitle = this.translate.instant('MYINFO.RETRIEVE_CPF_DATA.TITLE');
      ref.componentInstance.errorMessageHTML = this.translate.instant('MYINFO.RETRIEVE_CPF_DATA.DESCRIPTION');
      ref.componentInstance.primaryActionLabel = this.translate.instant('MYINFO.RETRIEVE_CPF_DATA.BTN-TEXT');
      ref.componentInstance.myInfo = true;
      ref.result.then(() => {
        this.myInfoService.setMyInfoAttributes('cpfbalances');
        this.myInfoService.goToMyInfo();
      }).catch((e) => {
      });
    }
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });

    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        const previousUrl = this.comprehensiveService.getPreviousUrl(this.router.url);
        if (previousUrl !== null) {
          this.router.navigate([previousUrl]);
        } else {
          this.navbarService.goBack();
        }
      }
    });

    this.buildMyAssetsForm();
    if (this.assetDetails && this.assetDetails.investmentPropertiesValue > 0) {
      this.myInvestmentProperties = false;
    }
    this.onTotalAssetsBucket();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
    if (this.myinfoChangeListener) {
      this.myinfoChangeListener.unsubscribe();
    }
  }

  buildMyAssetsForm() {
    const otherInvestFormArray = [];
    let inc = 0;
    if (this.assetDetails.assetsInvestmentSet && this.assetDetails.assetsInvestmentSet.length > 0) {
      this.assetDetails.assetsInvestmentSet.forEach((otherInvest, i) => {
        otherInvestFormArray.push(this.buildInvestmentForm(otherInvest, i));
        this.investType[inc] = otherInvest.typeOfInvestment;
        this.fundType[inc] = (!this.comprehensiveJourneyMode ) ? this.fundTypeLite : otherInvest.fundType;        
        inc++;
      });
    } else {
      otherInvestFormArray.push(this.buildInvestmentForm('', 0));
    }

    this.myAssetsForm = this.formBuilder.group({
      cashInBank: [{ value: this.assetDetails ? this.assetDetails.cashInBank : '', disabled: this.viewMode }, []],
      savingsBonds: [{ value: this.assetDetails ? this.assetDetails.savingsBonds : '', disabled: this.viewMode }, []],
      cpfOrdinaryAccount: [{ value: this.assetDetails ? this.assetDetails.cpfOrdinaryAccount : '', disabled: this.viewMode }, []],
      cpfSpecialAccount: [{ value: this.assetDetails ? this.assetDetails.cpfSpecialAccount : '', disabled: this.viewMode }, []],
      cpfMediSaveAccount: [{ value: this.assetDetails ? this.assetDetails.cpfMediSaveAccount : '', disabled: this.viewMode }, []],
      cpfRetirementAccount: [{ value: this.assetDetails ? this.assetDetails.cpfRetirementAccount : '', disabled: this.viewMode }, []],
      schemeType: [{
        value: (this.assetDetails && this.showRetirementAccount) ? this.assetDetails.schemeType : '',
        disabled: this.viewMode
      }, []],
      estimatedPayout: [{
        value: (this.assetDetails && this.showRetirementAccount) ? this.assetDetails.estimatedPayout : '',
        disabled: this.viewMode
      }, []],
      retirementSum: [{
        value: (this.assetDetails && this.showRetirementAccount) ? this.assetDetails.retirementSum : '',
        disabled: this.viewMode
      }, []],
      topupAmount: [{
        value: (this.assetDetails && this.showRetirementAccount) ? this.assetDetails.topupAmount : '',
        disabled: this.viewMode
      }, []],
      withdrawalAmount: [{
        value: (this.assetDetails && this.showRetirementAccount) ? this.assetDetails.withdrawalAmount : '',
        disabled: this.viewMode
      }, []],
      homeMarketValue: [{ value: this.assetDetails ? this.assetDetails.homeMarketValue : '', disabled: this.viewMode }, []],
      investmentPropertiesValue: [{
        value: this.assetDetails ? this.assetDetails.investmentPropertiesValue : '',
        disabled: this.viewMode
      }, []],
      assetsInvestmentSet: this.formBuilder.array(otherInvestFormArray),
      otherAssetsValue: [{ value: this.assetDetails ? this.assetDetails.otherAssetsValue : '', disabled: this.viewMode }, []]

    });
  }
  addOtherInvestment() {
    const otherPropertyControl = this.myAssetsForm.controls['investmentPropertiesValue'];
    if (this.myInvestmentProperties) {
      otherPropertyControl.setValidators([]);
      //otherPropertyControl.setValidators([Validators.required, Validators.pattern(this.patternValidator)]);
      otherPropertyControl.updateValueAndValidity();
    } else {
      otherPropertyControl.setValue('');
      otherPropertyControl.setValidators([]);
      otherPropertyControl.markAsDirty();
      otherPropertyControl.updateValueAndValidity();
    }
    this.onTotalAssetsBucket();
    this.myInvestmentProperties = !this.myInvestmentProperties;

  }
  addInvestment() {
    const investments = this.myAssetsForm.get('assetsInvestmentSet') as FormArray;
    investments.push(this.buildInvestmentForm('', investments.length));
    this.setInvestValidation(investments.length);
    this.onTotalAssetsBucket();
  }
  buildInvestmentForm(inputParams, totalLength) {
    const fundTypeValue = (!this.comprehensiveJourneyMode ) ? this.fundTypeLite : inputParams.fundType; 
    if (totalLength > 0) {
      return this.formBuilder.group({
        typeOfInvestment: [{ value: inputParams.typeOfInvestment, disabled: this.viewMode }, []],
        fundType: [{ value: fundTypeValue, disabled: this.viewMode }, []],
        investmentAmount: [{
          value: (inputParams && inputParams.investmentAmount) ? inputParams.investmentAmount : '',
          disabled: this.viewMode
        },
        []]
      });
    } else {
      return this.formBuilder.group({
        typeOfInvestment: [{ value: inputParams.typeOfInvestment, disabled: this.viewMode }, []],
        fundType: [{ value: fundTypeValue, disabled: this.viewMode }, []],
        investmentAmount: [{
          value: (inputParams && inputParams.investmentAmount) ? inputParams.investmentAmount : '',
          disabled: this.viewMode
        }, []]
      });
    }
  }
  removeInvestment(i) {
    const investments = this.myAssetsForm.get('assetsInvestmentSet') as FormArray;
    this.investType[i] = '';
    this.fundType[i] = '';
    investments.markAsDirty();
    investments.removeAt(i);
    this.setInvestValidation(investments.length);
    this.onTotalAssetsBucket();
  }
  selectInvestType(investType, i) {
    investType = investType ? investType : { text: '', value: '' };
    this.investType[i] = investType.text;
    this.myAssetsForm.controls['assetsInvestmentSet']['controls'][i].controls.typeOfInvestment.setValue(investType.text);
    this.myAssetsForm.markAsDirty();
  }
  selectFundType(fundType, i) {
    fundType = fundType ? fundType : { text: '', value: '' };
    this.fundType[i] = fundType.text;
    this.myAssetsForm.controls['assetsInvestmentSet']['controls'][i].controls.fundType.setValue(fundType.text);
    this.myAssetsForm.markAsDirty();
  }
  selectSchemeType(schemeType) {
    schemeType = schemeType ? schemeType : { text: '', value: '' };
    this.schemeType = schemeType.text;
    this.myAssetsForm.controls['schemeType'].setValue(schemeType.text);
    if (!this.viewMode) {
      this.myAssetsForm.markAsDirty();
    }
  }
  setInvestValidation(totalLength) {
    const otherInvestmentControl = this.myAssetsForm.controls['assetsInvestmentSet']['controls'][0].controls;
    
    otherInvestmentControl['typeOfInvestment'].setValidators([]);
    otherInvestmentControl['typeOfInvestment'].updateValueAndValidity();
    otherInvestmentControl['fundType'].setValidators([]);
    otherInvestmentControl['fundType'].updateValueAndValidity();
    otherInvestmentControl['investmentAmount'].setValidators([]);
    otherInvestmentControl['investmentAmount'].updateValueAndValidity();
  }
  get addAssetsValid() { return this.myAssetsForm.controls; }
  validateAssets(form: FormGroup) {
    this.submitted = true;
    if (this.comprehensiveService.getReportStatus() === COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {
      this.myAssetsForm.markAsDirty();
    }
    this.investTypeValidation();
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });
      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_ASSETS);
      if(error.errorMessages && !this.comprehensiveJourneyMode){
        error.errorMessages = [this.errorMessageLite];
      }
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_ASSETS'));
      return false;
    } else {
      this.submitted = false;
    }
    return true;
  }
  goToNext(form: FormGroup) {
    if (this.viewMode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
    } else {
      if (this.validateAssets(form)) {
        const assetsData = this.comprehensiveService.getComprehensiveSummary().comprehensiveAssets;
        if (!form.pristine || Util.isEmptyOrNull(assetsData)) {
          this.assetDetails = form.value;
          this.cpfFromMyInfo ? this.assetDetails.source = COMPREHENSIVE_CONST.CPF_SOURCE.MY_INFO : this.assetDetails.source = COMPREHENSIVE_CONST.CPF_SOURCE.MANUAL;
          this.assetDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.API_TOTAL_BUCKET_KEY] = this.totalAssets;
          this.assetDetails.enquiryId = this.comprehensiveService.getEnquiryId();
          this.assetDetails.assetsInvestmentSet.forEach((investDetails: any, index) => {
            this.assetDetails.assetsInvestmentSet[index].enquiryId = this.assetDetails.enquiryId;
            delete this.assetDetails['investmentAmount_' + index];
          });
          this.loaderService.showLoader({ title: this.saveData });
          this.comprehensiveApiService.saveAssets(this.assetDetails).subscribe((data) => {
            this.comprehensiveService.setMyAssets(this.assetDetails);
            if (this.comprehensiveService.getMySteps() === 1
              && this.comprehensiveService.getMySubSteps() < 5) {
              this.comprehensiveService.setStepCompletion(1, 5).subscribe((data1: any) => {
                this.loaderService.hideLoader();
                this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
              });
            } else {
              this.loaderService.hideLoader();
              this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
            }
          });
        } else {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
        }
      }
    }
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.MY_ASSETS.TOOLTIP.' + toolTipTitle),
      DESCRIPTION: this.translate.instant('CMP.MY_ASSETS.TOOLTIP.' + toolTipMessage)
    };
    if (toolTipTitle === 'SET_RETIREMENT_SUM_TITLE') {
      const sumTitle = this.translate.instant('CMP.MY_ASSETS.TOOLTIP.' + toolTipMessage);
      const toolTipParamsRetirementSum = {
        TITLE: this.translate.instant('CMP.MY_ASSETS.TOOLTIP.' + toolTipTitle),
        DESCRIPTION: sumTitle.replace('BRS_VAL', this.brsConfig).replace('FRS_VAL', this.frsConfig)
      };
      this.comprehensiveService.openTooltipModal(toolTipParamsRetirementSum);
    } else {
      this.comprehensiveService.openTooltipModal(toolTipParams);
    }
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.onTotalAssetsBucket();
    this.investTypeValidation();
  }
  getMyInfoData() {
    this.myInfoService.getMyInfoData().subscribe((data: any) => {
    });
  }
  onTotalAssetsBucket() {
    const assetFormObject = this.myAssetsForm.value;
    let bucketParams = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.BUCKET_INPUT_CALC;
    let popInputBucket = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.POP_FORM_INPUT;
    bucketParams = bucketParams.slice(0);
    this.myAssetsForm.value.assetsInvestmentSet.forEach((investDetails: any, index) => {
      assetFormObject['investmentAmount_' + index] = investDetails.investmentAmount;
      bucketParams.push('investmentAmount_' + index);
    });
    const filterInput = this.comprehensiveService.unSetObjectByKey(assetFormObject, popInputBucket);
    this.totalAssets = this.comprehensiveService.additionOfCurrency(filterInput);
    this.bucketImage = this.comprehensiveService.setBucketImage(bucketParams, assetFormObject, this.totalAssets);
  }
  investTypeValidation() {
    if (this.myAssetsForm.controls['assetsInvestmentSet']['controls'].length > 0) {
      this.myAssetsForm.controls['assetsInvestmentSet']['controls'].forEach((otherInvest, i) => {
        const otherInvestmentControl = this.myAssetsForm.controls['assetsInvestmentSet']['controls'][i].controls;
        if (otherInvestmentControl['investmentAmount'].value > 0) {
          otherInvestmentControl['typeOfInvestment'].setValidators([Validators.required]);
          otherInvestmentControl['typeOfInvestment'].updateValueAndValidity();
          otherInvestmentControl['fundType'].setValidators([Validators.required]);
          otherInvestmentControl['fundType'].updateValueAndValidity();
        } else {
          otherInvestmentControl['typeOfInvestment'].setValidators([]);
          otherInvestmentControl['typeOfInvestment'].updateValueAndValidity();
          otherInvestmentControl['fundType'].setValidators([]);
          otherInvestmentControl['fundType'].updateValueAndValidity();
        }
      });
      this.myAssetsForm.markAsDirty();
    }
  }
  // NRIC used error modal
  openNricErrorModal() {
    if (!this.viewMode) {
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'nric-used-modal'});
      ref.componentInstance.errorTitle = this.translate.instant('MYINFO.NRIC_USED_ERROR.TITLE');
      ref.componentInstance.errorMessageHTML = this.translate.instant('MYINFO.NRIC_USED_ERROR.DESCRIPTION');
      ref.componentInstance.primaryActionLabel = this.translate.instant('MYINFO.NRIC_USED_ERROR.BTN-TEXT');
      ref.componentInstance.closeAction.subscribe(() => {
        this.modal.dismissAll();
      });
      ref.result.then((data) => {
        this.modal.dismissAll();
      }).catch((e) => {
      });
    }
  }

  editCPFFields(){
    if(this.cpfFromMyInfo){
      this.cpfFromMyInfo = false;
      this.showEditIcon = false;
      this.assetDetails.source = COMPREHENSIVE_CONST.CPF_SOURCE.MANUAL;
    }
  }
}
