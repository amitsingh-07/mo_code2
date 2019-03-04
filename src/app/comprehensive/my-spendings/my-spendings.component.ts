import { Component, OnInit, HostListener } from '@angular/core';
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
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { IMySpendings } from '../comprehensive-types';

@Component({
  selector: 'app-my-spendings',
  templateUrl: './my-spendings.component.html',
  styleUrls: ['./my-spendings.component.scss']
})
export class MySpendingsComponent implements OnInit {
  pageTitle: string;
  mySpendingsForm: FormGroup;
  submitted: boolean;
  spendingDetails: IMySpendings;
  otherMortage = true;
  validateFlag = true;
  totalSpending = 0;
  calculatedSpending = 0;
  totalBucket = 14000;
  spendDesc: string;
  spendTitle: string;
  menuClickSubscription: Subscription;
  pageId: string;
  mortageFieldSet = ['mortgagePaymentUsingCPF','mortgagePaymentUsingCash','mortgageTypeOfHome','mortgagePayOffUntil'];
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
      this.spendDesc = this.translate.instant('CMP.MY_SPENDINGS.SPEND_DESC');
      this.spendTitle = this.translate.instant('CMP.MY_SPENDINGS.SPEND_TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.spendingDetails=this.comprehensiveService.getMySpendings();   
    console.log(this.spendingDetails);      
  }  
  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
    this.buildMySpendingForm();
    if(this.spendingDetails){
      for (var value of this.mortageFieldSet)  
      {      
        
        if(this.spendingDetails[value] !== null && this.spendingDetails[value] !== ''  &&  (this.spendingDetails[value]>0 || (value == 'mortgageTypeOfHome' && this.spendingDetails[value] !== undefined )  )){
            this.validateFlag = false;
        } 
      }
      if(!this.validateFlag){
        this.addOtherMortage(); 
      }
    } 
    this.onTotalAnnualSpendings();
    
       
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  addOtherMortage() {
  
   for (var value of this.mortageFieldSet)  
   {
      const otherPropertyControl = this.mySpendingsForm.controls[value];
      if(this.otherMortage){     
        if(value == 'mortgagePayOffUntil')
          otherPropertyControl.setValidators([Validators.required,Validators.pattern("\\d{4,4}")]);
        else        
       	  otherPropertyControl.setValidators([Validators.required]);
        otherPropertyControl.updateValueAndValidity();
      } else {
        otherPropertyControl.setValue('');
        otherPropertyControl.setValidators([]);
        otherPropertyControl.updateValueAndValidity();
      } 
    }    
    this.otherMortage = !this.otherMortage;     
  }
  buildMySpendingForm() {
    this.mySpendingsForm = this.formBuilder.group({
      monthlyLivingExpenses: [this.spendingDetails ? this.spendingDetails.monthlyLivingExpenses:'', [Validators.required]],
      adHocExpenses: [this.spendingDetails ? this.spendingDetails.adHocExpenses:'', [Validators.required]],
      HLMortgagePaymentUsingCPF: [this.spendingDetails ? this.spendingDetails.HLMortgagePaymentUsingCPF:'', [Validators.required]],
      HLMortgagePaymentUsingCash: [this.spendingDetails ? this.spendingDetails.HLMortgagePaymentUsingCash:'', [Validators.required]],
      HLtypeOfHome: [this.spendingDetails ? this.spendingDetails.HLtypeOfHome:'', [Validators.required]],
      homeLoanPayOffUntil: [this.spendingDetails ? this.spendingDetails.homeLoanPayOffUntil:'', [Validators.required,Validators.pattern("\\d{4,4}")]],
      mortgagePaymentUsingCPF: [this.spendingDetails ? this.spendingDetails.mortgagePaymentUsingCPF:''],
      mortgagePaymentUsingCash: [ this.spendingDetails ? this.spendingDetails.mortgagePaymentUsingCash:''],
      mortgageTypeOfHome: [ this.spendingDetails ? this.spendingDetails.mortgageTypeOfHome:''],
      mortgagePayOffUntil: [ this.spendingDetails ? this.spendingDetails.mortgagePayOffUntil:''],
      carLoanPayment: [ this.spendingDetails ? this.spendingDetails.carLoanPayment:'', [Validators.required]],
      otherLoanPayment: [ this.spendingDetails ? this.spendingDetails.otherLoanPayment:'', [Validators.required]],
      otherLoanPayoffUntil: [ this.spendingDetails ? this.spendingDetails.otherLoanPayoffUntil:'', [Validators.required,Validators.pattern("\\d{4,4}")]]
    });
  }
  goToNext(form: FormGroup) {    
     if (this.validateSpendings(form)) {
      this.comprehensiveService.setMySpendings(form.value);
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN]);
    }
  }
  validateSpendings(form: FormGroup) {
    this.submitted = false;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });
     
      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_SPENDINGS);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_SPENDINGS'));
      return false;
    }
    return true;
  }
  showToolTipModal(toolTipTitle, toolTipMessage){
    let toolTipParams = { TITLE: this.translate.instant('CMP.MY_SPENDINGS.TOOLTIP.'+toolTipTitle), 
    DESCRIPTION: this.translate.instant('CMP.MY_SPENDINGS.TOOLTIP.'+toolTipMessage)};
    this.comprehensiveService.openTooltipModal(toolTipParams); 
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.onTotalAnnualSpendings();
  }
  
  onTotalAnnualSpendings(){
    const inputParams = ['monthlyLivingExpenses'];    
    const spendingValues = this.mySpendingsForm.value;
    const spendingFormObject = { monthlyLivingExpenses: spendingValues.monthlyLivingExpenses, adHocExpenses: spendingValues.adHocExpenses };
    this.totalSpending = this.comprehensiveService.additionOfCurrency(spendingFormObject, inputParams);
    this.calculatedSpending = this.totalBucket - this.totalSpending;
    /*this.totalAnnualIncomeBucket = this.comprehensiveService.additionOfCurrency(this.myEarningsForm.value, inputParams);   
    if(this.totalAnnualIncomeBucket > 0)
      this.bucketImage = this.translate.instant('CMP.MY_EARNINGS.FILLED_BUCKET_IMAGE');
    else
      this.bucketImage = this.translate.instant('CMP.MY_EARNINGS.EMPTY_BUCKET_IMAGE');*/
  }
}
