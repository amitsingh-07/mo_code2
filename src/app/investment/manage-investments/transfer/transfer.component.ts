import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../manage-investments-routes.constants';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../manage-investments.constants';
import { ManageInvestmentsService } from '../manage-investments.service';
import { environment } from './../../../../environments/environment';
import { AuthenticationService } from './../../../shared/http/auth/authentication.service';
import { TransferWithdrawalModalComponent } from './transfer-withdrawal-modal/transfer-withdrawal-modal.component';
import { element } from 'protractor';


@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DecimalPipe]
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
 sourceCashPortfolioList;
  formValues: any;
  userProfileInfo: any;
  pageTitle : string;
  isTransferAllChecked = false;
  cashBalance :any;
  initalCashPortfolio:any;
  destinationCashPortfolioList;
  noteArray = [
    "Transfer service will not be available from 11:30pm to 12:00am daily for system maintenance. In the event that the service is unavailable or unsuccesssful, please try again later.",
    "Transfer between Cash Accounts will be processed and completed immediately. "
    
  ];
  private subscription: Subscription;
  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public manageInvestmentsService: ManageInvestmentsService,
    private loaderService: LoaderService,
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    public authService: AuthenticationService,
    private decimalPipe: DecimalPipe
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('Transfer between Cash Accounts');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(105);
    } else {
      this.navbarService.setNavbarMode(103);
    }
    this.footerService.setFooterVisibility(false);
   
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.getTransferCashPortfolioList();
   
   
   
  }
  getTransferCashPortfolioList() {
    let sourceCashPortfolioList =[];
    this.manageInvestmentsService.getTransferCashPortfolioList().subscribe((data) => {
      this.sourceCashPortfolioList = data.objectList;
       console.log(this.sourceCashPortfolioList);
      this.buildForm();
      this.cashBalance = (this.transferForm.get('transferFrom').value && this.transferForm.get('transferFrom').value.cashAccountBalance)  ? this.transferForm.get('transferFrom').value.cashAccountBalance  :this.transferForm.get('transferFrom').value.accountBalance;
      this.destinationcCashPortfolioList();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  setDropDownValue(kay, value) {
   this.transferForm.controls[kay].setValue(value);
   this.cashBalance = this.transferForm.get('transferFrom').value ?
   this.transferForm.get('transferFrom').value.cashAccountBalance  :this.transferForm.get('transferFrom').value.accountBalance;
   this.transferForm.controls.transferTo.setValue(null);
   this.transferForm.controls.transferAmount.setValue("0");
   this.transferForm.get('transferAmount').enable();
   this.transferForm.controls.transferAll.setValue(false);
   this.isTransferAllChecked = false;
   this.destinationcCashPortfolioList();
  }
  setDropDownValueTwo(kay, value) {
    this.transferForm.controls[kay].setValue(value);
  }
 
 buildForm() {
      this.transferForm = this.formBuilder.group({
      transferFrom: [this.formValues.transferFrom 
          ? this.formValues.transferFrom :
          this.formValues.selectedCustomerPortfolio, 
          new FormControl('', Validators.required)],
        transferTo: [this.formValues.transferTo, Validators.required],
        transferAmount: [this.formValues.transferAmount, 
          [Validators.required,
            this.transferAmountValidator(
           )]],
           transferAll: []
      });
      
  }
  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }
  goToNext(From) {
    this.manageInvestmentsService.setTransfrFormData(From);
    this.showConfirmWithdrawModal(From);
    //this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
  }
  TransferAllChecked() {
  if (this.transferForm.controls.transferAll.value && this.transferForm.controls.transferFrom.value) {
        const cashBalance = this.transferForm.get('transferFrom').value.cashAccountBalance ? this.transferForm.get('transferFrom').value.cashAccountBalance.toString() : this.transferForm.get('transferFrom').value.accountBalance.toString() ; 
        this.transferForm.controls.transferAmount.setValue(cashBalance);
        this.transferForm.get('transferAmount').disable();
        this.isTransferAllChecked = true;
      } else {
        this.transferForm.controls.transferAmount.setValue("0");
        this.transferForm.get('transferAmount').enable();
        this.isTransferAllChecked = false;
      
    }
  }

  showConfirmWithdrawModal(form) {
    const ref = this.modal.open(TransferWithdrawalModalComponent, {
      centered: true
    });
    ref.componentInstance.transferFrom = this.transferForm.get('transferFrom').value;
    ref.componentInstance.transferTo = this.transferForm.get('transferTo').value;
    ref.componentInstance.TransferAmount =this.transferForm.get('transferAmount').value;
    ref.componentInstance.afterTransfer = this.cashBalance - this.transferForm.controls.transferAmount.value;
    ref.componentInstance.confirmed.subscribe(() => {
      ref.dismiss();
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TRANSFER_SUCCESS]);
    
      
    });
   }
   
   destinationcCashPortfolioList() {
    this.destinationCashPortfolioList= [];
    this.initalCashPortfolio = (this.transferForm.get('transferFrom').value && this.transferForm.get('transferFrom').value.portfolioName) ? this.transferForm.get('transferFrom').value.portfolioName :this.formValues.selectedCustomerPortfolio.portfolioName;
    this.sourceCashPortfolioList.forEach(element => {
     if(this.initalCashPortfolio !== element.portfolioName ){
       return this.destinationCashPortfolioList.push(element);
     }
     
   });
   console.log(this.destinationCashPortfolioList);
   return this.destinationCashPortfolioList;
  
   }
   transferAmountValidator(): ValidatorFn {
      this.cashBalance = this.cashBalance ? parseFloat(this.decimalPipe.transform(this.cashBalance, "1.2-2").replace(/,/g, "")) : 0;
    return (control: AbstractControl) => {
      if (control && !isNaN(control.value)) {
        let userInput = control.value ? parseFloat(this.decimalPipe.transform(control.value.replace(/,/g, ""), "1.2-2").replace(/,/g, "")) : 0;
        if (userInput <= 0) { 
          return { MinValue: true };
        }
        else if (userInput > this.cashBalance) { 
          return { MoreThanCashBalance: true };
          }
        }
      }
    }
  
}
