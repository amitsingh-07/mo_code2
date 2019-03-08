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
  console.log(this.comprehensiveService.getMyAssets());
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
    if(this.assetDetails && this.assetDetails.investmentProperties > 0){      
      this.myInvestmentProperties = false;
    }
    this.onTotalAssetsBucket();
    
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }
  buildMyAssetsForm() {
    const otherInvestFormArray = []; var inc = 0;
    if(this.assetDetails.otherinvestment && this.assetDetails.otherinvestment.length>0){
      this.assetDetails.otherinvestment.forEach((otherInvest,i) => {       
        if(otherInvest.investmentType !== '' || otherInvest.others > 0) {           
          otherInvestFormArray.push(this.buildInvestmentForm(otherInvest));
          this.investType[inc] = otherInvest.investmentType;
          inc++;
        }
      });
    } else {
      otherInvestFormArray.push(this.buildInvestmentForm(''));
    }

    this.myAssetsForm = this.formBuilder.group({
      cashInBank: [this.assetDetails ? this.assetDetails.cashInBank : '', [Validators.required]],
      singaporeSavingsBond: [this.assetDetails ? this.assetDetails.singaporeSavingsBond : '', [Validators.required]],
      CPFOA: [this.assetDetails ? this.assetDetails.CPFOA : '', [Validators.required]],
      CPFSA: [this.assetDetails ? this.assetDetails.CPFSA : '', [Validators.required]],
      CPFMA: [this.assetDetails ? this.assetDetails.CPFMA : '', [Validators.required]],
      yourHome: [this.assetDetails ? this.assetDetails.yourHome : '', [Validators.required]],
      investmentProperties: [this.assetDetails ? this.assetDetails.investmentProperties : '', [Validators.required]],
      otherinvestment: this.formBuilder.array(otherInvestFormArray),
      otherAssets: [this.assetDetails ? this.assetDetails.otherAssets : '', [Validators.required]]
    });
  }
  addOtherInvestment() { 
    this.myInvestmentProperties = !this.myInvestmentProperties;

  }
  addInvestment() {
    const investments = this.myAssetsForm.get('otherinvestment') as FormArray;
    investments.push(this.buildInvestmentForm(''));
  }
  buildInvestmentForm(inputParams) {
    return this.formBuilder.group({
      investmentType: [inputParams.investmentType, [Validators.required]],
      others: [(inputParams && inputParams.others)?inputParams.others:'', [Validators.required]]
    });
  }
  removeInvestment(i) {
    const investments = this.myAssetsForm.get('otherinvestment') as FormArray;
    investments.removeAt(i);
  }
  selectInvestType(investType, i) {
    investType = investType ? investType : { text: '', value: '' };
    this.investType[i] = investType.text;   
    this.myAssetsForm.controls['otherinvestment']['controls'][i].controls.investmentType.setValue(investType.text);
    this.myAssetsForm.markAsDirty();
  }

  goToNext(form) {
    this.comprehensiveService.setMyAssets(form.value);
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = { TITLE: this.translate.instant('CMP.MY_ASSETS.TOOLTIP.' + toolTipTitle),
    DESCRIPTION: this.translate.instant('CMP.MY_ASSETS.TOOLTIP.' + toolTipMessage)};
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.onTotalAssetsBucket();
  }

  onTotalAssetsBucket() {
    const assetFormObject = this.myAssetsForm.value;
    this.myAssetsForm.value.otherinvestment.forEach((investDetails: any, index) => {      
      assetFormObject['otherInvestment'+index] = investDetails.others;
    });
    this.totalAssets = this.comprehensiveService.additionOfCurrency(assetFormObject);
  }

}
