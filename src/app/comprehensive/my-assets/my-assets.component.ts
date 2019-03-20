import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';
import { IMyAssets } from '../comprehensive-types';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { analyzeAndValidateNgModules } from '@angular/compiler';

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
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService) {
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
    });
    this.assetDetails = this.comprehensiveService.getMyAssets();
    //console.log(this.comprehensiveService.getMyAssets());
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
    this.buildMyAssetsForm();
    if (this.assetDetails && this.assetDetails.investmentProperties > 0) {
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
    if (this.assetDetails.otherInvestment && this.assetDetails.otherInvestment.length > 0) {
      this.assetDetails.otherInvestment.forEach((otherInvest, i) => {
        if (otherInvest.investmentType !== '' || otherInvest.others > 0) {
          otherInvestFormArray.push(this.buildInvestmentForm(otherInvest, i));
          this.investType[inc] = otherInvest.investmentType;
          inc++;
        }
      });
    } else {
      otherInvestFormArray.push(this.buildInvestmentForm('', 0));
    }

    this.myAssetsForm = this.formBuilder.group({
      cashInBank: [this.assetDetails ? this.assetDetails.cashInBank : '', []],
      singaporeSavingsBond: [this.assetDetails ? this.assetDetails.singaporeSavingsBond : '', []],
      CPFOA: [this.assetDetails ? this.assetDetails.CPFOA : '', []],
      CPFSA: [this.assetDetails ? this.assetDetails.CPFSA : '', []],
      CPFMA: [this.assetDetails ? this.assetDetails.CPFMA : '', []],
      yourHome: [this.assetDetails ? this.assetDetails.yourHome : '', []],
      investmentProperties: [this.assetDetails ? this.assetDetails.investmentProperties : '', []],
      otherInvestment: this.formBuilder.array(otherInvestFormArray),
      otherAssets: [this.assetDetails ? this.assetDetails.otherAssets : '', []]
    });
  }
  addOtherInvestment() {
    const otherPropertyControl = this.myAssetsForm.controls['investmentProperties'];
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
    const investments = this.myAssetsForm.get('otherInvestment') as FormArray;
    investments.push(this.buildInvestmentForm('', investments.length));
    this.setInvestValidation(investments.length);
  }
  buildInvestmentForm(inputParams, totalLength) {
    if (totalLength > 0) {
    return this.formBuilder.group({
      investmentType: [inputParams.investmentType, [Validators.required]],
      others: [(inputParams && inputParams.others) ? inputParams.others : '', [Validators.required, Validators.pattern('^0*[1-9]\\d*$')]]
    });
    } else {
      return this.formBuilder.group({
        investmentType: [inputParams.investmentType, []],
        others: [(inputParams && inputParams.others) ? inputParams.others : '', []]
      });
    }
  }
  removeInvestment(i) {
    const investments = this.myAssetsForm.get('otherInvestment') as FormArray;
    this.investType[i] = '';
    investments.removeAt(i);
    this.setInvestValidation(investments.length);
  }
  selectInvestType(investType, i) {
    investType = investType ? investType : { text: '', value: '' };
    this.investType[i] = investType.text;
    this.myAssetsForm.controls['otherInvestment']['controls'][i].controls.investmentType.setValue(investType.text);
    this.myAssetsForm.markAsDirty();
  }
  setInvestValidation(totalLength) {
    const otherInvestmentControl = this.myAssetsForm.controls['otherInvestment']['controls'][0].controls;
    if (totalLength === 1) {
      otherInvestmentControl['investmentType'].setValidators([]);
      otherInvestmentControl['investmentType'].updateValueAndValidity();
      otherInvestmentControl['others'].setValidators([]);
      otherInvestmentControl['others'].updateValueAndValidity();
    } else {
      otherInvestmentControl['investmentType'].setValidators([Validators.required]);
      otherInvestmentControl['investmentType'].updateValueAndValidity();
      otherInvestmentControl['others'].setValidators([Validators.required, Validators.pattern('^0*[1-9]\\d*$')]);
      otherInvestmentControl['others'].updateValueAndValidity();
    }
  }
  get addAssetsValid() { return this.myAssetsForm.controls; }
  validateAssets(form: FormGroup) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });
      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_ASSETS);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
      this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_ASSETS'));
      return false;
    }
    return true;
  }
  goToNext(form: FormGroup) {
    if (this.validateAssets(form)) {
      this.comprehensiveService.setMyAssets(form.value);
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
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
    this.myAssetsForm.value.otherInvestment.forEach((investDetails: any, index) => {
      assetFormObject['otherInvestment' + index] = investDetails.others;
    });
    this.totalAssets = this.comprehensiveService.additionOfCurrency(assetFormObject);
    const bucketParams = ['cashInBank', 'singaporeSavingsBond', 'CPFOA', 'CPFSA', 'CPFMA', 'yourHome', 'otherInvestment0', 'otherAssets'];
    this.bucketImage = this.comprehensiveService.setBucketImage(bucketParams, assetFormObject);
  }
}
