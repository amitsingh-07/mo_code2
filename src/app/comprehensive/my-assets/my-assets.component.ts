import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { MyInfoService } from '../../shared/Services/my-info.service';
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

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
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
  // tslint:disable-next-line:cognitive-complexity
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private progressService: ProgressTrackerService, private loaderService: LoaderService, private myInfoService: MyInfoService,
    private modal: NgbModal) {
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
      });
    });
    this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '') {
        if (myinfoObj.status && myinfoObj.status === 'SUCCESS' && this.myInfoService.isMyInfoEnabled) {
          this.myInfoService.getMyInfoData().subscribe((data) => {
            if (data && data['objectList']) {
              const cpfValues = data.objectList[0].cpfbalances;
              const oaFormControl = this.myAssetsForm.controls['cpfOrdinaryAccount'];
              const saFormControl = this.myAssetsForm.controls['cpfSpecialAccount'];
              const maFormControl = this.myAssetsForm.controls['cpfMediSaveAccount'];
              oaFormControl.setValue(cpfValues.oa);
              saFormControl.setValue(cpfValues.sa);
              maFormControl.setValue(cpfValues.ma);
              oaFormControl.markAsDirty();
              saFormControl.markAsDirty();
              maFormControl.markAsDirty();

              this.onTotalAssetsBucket();
              this.cpfFromMyInfo = true;
              this.myInfoService.isMyInfoEnabled = false;
              this.closeMyInfoPopup();
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
    if (this.assetDetails && this.assetDetails.source === 'MyInfo') {
      this.cpfFromMyInfo = true;
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
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = 'Oops, Error!';
      ref.componentInstance.errorMessage = 'We weren\'t able to fetch your data from MyInfo.';
      ref.componentInstance.isError = true;
      this.cpfFromMyInfo = false;
      ref.result.then(() => {
        this.myInfoService.goToMyInfo();
      }).catch((e) => {
      });
    }
  }

  openModal() {
    if (!this.viewMode) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.translate.instant('MYINFO.OPEN_MODAL_DATA.TITLE');
      ref.componentInstance.errorMessage = this.translate.instant('MYINFO.OPEN_MODAL_DATA.DESCRIPTION');
      ref.componentInstance.isButtonEnabled = true;
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
  }

  buildMyAssetsForm() {
    const otherInvestFormArray = [];
    let inc = 0;
    if (this.assetDetails.assetsInvestmentSet && this.assetDetails.assetsInvestmentSet.length > 0) {
      this.assetDetails.assetsInvestmentSet.forEach((otherInvest, i) => {
        if (otherInvest.typeOfInvestment !== '' || otherInvest.investmentAmount > 0) {
          otherInvestFormArray.push(this.buildInvestmentForm(otherInvest, i));
          this.investType[inc] = otherInvest.typeOfInvestment;
          inc++;
        }
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
      otherPropertyControl.setValidators([Validators.required, Validators.pattern(this.patternValidator)]);
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
    if (totalLength > 0) {
      return this.formBuilder.group({
        typeOfInvestment: [{ value: inputParams.typeOfInvestment, disabled: this.viewMode }, [Validators.required]],
        investmentAmount: [{
          value: (inputParams && inputParams.investmentAmount) ? inputParams.investmentAmount : '',
          disabled: this.viewMode
        },
        [Validators.required, Validators.pattern(this.patternValidator)]]
      });
    } else {
      return this.formBuilder.group({
        typeOfInvestment: [{ value: inputParams.typeOfInvestment, disabled: this.viewMode }, []],
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
  setInvestValidation(totalLength) {
    const otherInvestmentControl = this.myAssetsForm.controls['assetsInvestmentSet']['controls'][0].controls;
    if (totalLength === 1) {
      otherInvestmentControl['typeOfInvestment'].setValidators([]);
      otherInvestmentControl['typeOfInvestment'].updateValueAndValidity();
      otherInvestmentControl['investmentAmount'].setValidators([]);
      otherInvestmentControl['investmentAmount'].updateValueAndValidity();
    } else {
      otherInvestmentControl['typeOfInvestment'].setValidators([Validators.required]);
      otherInvestmentControl['typeOfInvestment'].updateValueAndValidity();
      otherInvestmentControl['investmentAmount'].setValidators([Validators.required, Validators.pattern(this.patternValidator)]);
      otherInvestmentControl['investmentAmount'].updateValueAndValidity();
    }
  }
  get addAssetsValid() { return this.myAssetsForm.controls; }
  validateAssets(form: FormGroup) {
    this.submitted = true;
    if (this.validationFlag === true && !form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });
      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_ASSETS);
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
        this.cpfFromMyInfo ? this.assetDetails.source = 'MyInfo' : this.assetDetails.source = 'MANUAL';
        this.assetDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.API_TOTAL_BUCKET_KEY] = this.totalAssets;
        this.assetDetails.enquiryId = this.comprehensiveService.getEnquiryId();
        this.assetDetails.assetsInvestmentSet.forEach((investDetails: any, index) => {
          this.assetDetails.assetsInvestmentSet[index].enquiryId = this.assetDetails.enquiryId;
          delete this.assetDetails['investmentAmount_' + index];
        });
        this.comprehensiveService.setMyAssets(this.assetDetails);
        this.loaderService.showLoader({ title: 'Saving' });
        this.comprehensiveApiService.saveAssets(this.assetDetails).subscribe((data) => {
          this.loaderService.hideLoader();
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
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
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.onTotalAssetsBucket();
  }
  getMyInfoData() {
    this.myInfoService.getMyInfoData().subscribe((data: any) => {
    });
  }
  onTotalAssetsBucket() {
    const assetFormObject = this.myAssetsForm.value;
    let bucketParams = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.BUCKET_INPUT_CALC;
    bucketParams = bucketParams.slice(0);
    this.myAssetsForm.value.assetsInvestmentSet.forEach((investDetails: any, index) => {
      assetFormObject['investmentAmount_' + index] = investDetails.investmentAmount;
      bucketParams.push('investmentAmount_' + index);
    });
    this.totalAssets = this.comprehensiveService.additionOfCurrency(assetFormObject);
    this.bucketImage = this.comprehensiveService.setBucketImage(bucketParams, assetFormObject, this.totalAssets);
  }
}
