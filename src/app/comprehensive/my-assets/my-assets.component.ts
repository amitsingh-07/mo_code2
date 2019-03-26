import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ConfigService } from './../../config/config.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { IMyAssets } from '../comprehensive-types';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { LoaderService } from './../../shared/components/loader/loader.service';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements OnInit {
  RSPForm: any;
  pageTitle: string;
  myAssetsForm: FormGroup;
  myInvestmentProperties = true;
  investmentTypeList: any;
  investType = [];
  totalAssets = 0;
  assetDetails: IMyAssets;
  menuClickSubscription: Subscription;
  pageId: string;
  submitted: boolean;
  bucketImage: string;
  validationFlag: boolean;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private progressService: ProgressTrackerService, private loaderService: LoaderService) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
      this.investmentTypeList = this.translate.instant('CMP.MY_ASSETS.INVESTMENT_TYPE_LIST');

      this.setPageTitle(this.pageTitle);
      this.validationFlag = this.translate.instant('CMP.MY_ASSETS.OPTIONAL_VALIDATION_FLAG');
    });
    this.assetDetails = this.comprehensiveService.getMyAssets();
    //console.log(this.comprehensiveService.getMyAssets());
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
    this.buildMyAssetsForm();
    if (this.assetDetails && this.assetDetails.investmentPropertiesValue > 0) {
      this.myInvestmentProperties = false;
    }
    this.onTotalAssetsBucket();

  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
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
      cashInBank: [this.assetDetails ? this.assetDetails.cashInBank : '', []],
      savingsBonds: [this.assetDetails ? this.assetDetails.savingsBonds : '', []],
      cpfOrdinaryAccount: [this.assetDetails ? this.assetDetails.cpfOrdinaryAccount : '', []],
      cpfSpecialAccount: [this.assetDetails ? this.assetDetails.cpfSpecialAccount : '', []],
      cpfMediSaveAccount: [this.assetDetails ? this.assetDetails.cpfMediSaveAccount : '', []],
      homeMarketValue: [this.assetDetails ? this.assetDetails.homeMarketValue : '', []],
      investmentPropertiesValue: [this.assetDetails ? this.assetDetails.investmentPropertiesValue : '', []],
      assetsInvestmentSet: this.formBuilder.array(otherInvestFormArray),
      otherAssetsValue: [this.assetDetails ? this.assetDetails.otherAssetsValue : '', []]
    });
  }
  addOtherInvestment() {
    const otherPropertyControl = this.myAssetsForm.controls['investmentPropertiesValue'];
    if (this.myInvestmentProperties) {
      otherPropertyControl.setValidators([Validators.required, Validators.pattern('^0*[1-9]\\d*$')]);
      otherPropertyControl.updateValueAndValidity();
    } else {
      otherPropertyControl.setValue('');
      otherPropertyControl.setValidators([]);
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
      typeOfInvestment: [inputParams.typeOfInvestment, [Validators.required]],
      investmentAmount: [(inputParams && inputParams.investmentAmount) ? inputParams.investmentAmount : '', [Validators.required, Validators.pattern('^0*[1-9]\\d*$')]]
    });
    } else {
      return this.formBuilder.group({
        typeOfInvestment: [inputParams.typeOfInvestment, []],
        investmentAmount: [(inputParams && inputParams.investmentAmount) ? inputParams.investmentAmount : '', []]
      });
    }
  }
  removeInvestment(i) {
    const investments = this.myAssetsForm.get('assetsInvestmentSet') as FormArray;
    this.investType[i] = '';
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
      otherInvestmentControl['investmentAmount'].setValidators([Validators.required, Validators.pattern('^0*[1-9]\\d*$')]);
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
    if (this.validateAssets(form)) {
      if (!form.pristine) {
        this.assetDetails = form.value;
        this.assetDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.API_TOTAL_BUCKET_KEY] = this.totalAssets;
        this.assetDetails.enquiryId = this.comprehensiveService.getEnquiryId();
        this.assetDetails.assetsInvestmentSet.forEach((investDetails: any, index) => {
          this.assetDetails.assetsInvestmentSet[index].enquiryId = this.assetDetails.enquiryId;
          delete this.assetDetails['investmentAmount_' + index];
        });
        this.comprehensiveService.setMyAssets(this.assetDetails);
        // this.loaderService.showLoader({ title: 'Saving' });
        // this.comprehensiveApiService.saveAssets(this.assetDetails).subscribe((data) => {
        //   this.loaderService.hideLoader();
             this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
        // });
      } else {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
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
