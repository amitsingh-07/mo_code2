import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
import { ManageInvestmentsService } from '../manage-investments.service';
import { environment } from './../../../../environments/environment';
import { TransferModalComponent } from './transfer-modal/transfer-modal.component';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DecimalPipe]
})
export class TransferComponent implements OnInit, OnDestroy {
  transferForm: FormGroup;
  sourceCashPortfolioList: any;
  formValues: any;
  userProfileInfo: any;
  pageTitle: string;
  isTransferAllChecked = false;
  cashBalance: any;
  initialCashPortfolio: any;
  destinationCashPortfolioList;
  isRequestSubmitted = false;
  noteArray: any;
  cashPortfolioList: any;
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
    private decimalPipe: DecimalPipe
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('TRANSFER.TITLE');
      this.setPageTitle(this.pageTitle);
      this.noteArray = this.translate.instant('TRANSFER.TRANSFER_NOTE');
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
    this.manageInvestmentsService.getTransferCashPortfolioList().subscribe((data) => {
      this.cashPortfolioList = data.objectList;
      this.sourceCashPortfolio(this.cashPortfolioList);
      this.buildForm();
      this.setSelectedPortfolio();
      this.cashBalance = this.transferForm.get('transferFrom').value ? this.transferForm.get('transferFrom').value.cashAccountBalance : 0;
      this.destinationCashPortfolio(this.cashPortfolioList);
    });
  }

  sourceCashPortfolio(cashPortfolioList) {
    this.sourceCashPortfolioList = [];
    cashPortfolioList.forEach(element => {
      if (element.cashAccountBalance > 0) {
        return this.sourceCashPortfolioList.push(element);
      }
    });
    return this.sourceCashPortfolioList;
  }

  destinationCashPortfolio(cashPortfolioList) {
    this.destinationCashPortfolioList = [];
    if (this.transferForm.get('transferFrom').value) {
      this.initialCashPortfolio = (this.transferForm.get('transferFrom').value && this.transferForm.get('transferFrom').value.portfolioName) ? this.transferForm.get('transferFrom').value.portfolioName : this.formValues.selectedCustomerPortfolio.portfolioName;
      cashPortfolioList.forEach(element => {
        if (this.initialCashPortfolio !== element.portfolioName) {
          return this.destinationCashPortfolioList.push(element);
        }

      });
      return this.destinationCashPortfolioList;
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
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

  setSelectedPortfolio() {
    if (this.formValues) {
      const customerPortfolioId = this.formValues.transferFrom ?
        this.formValues.transferFrom.customerPortfolioId : this.formValues.selectedCustomerPortfolio;
      if (this.formValues.selectedCustomerPortfolio && this.formValues.selectedCustomerPortfolio.portfolioName) {
        const data = this.sourceCashPortfolioList.find((portfolio) => {
          return portfolio.portfolioName === this.formValues.selectedCustomerPortfolio.portfolioName;
        });
        this.setTransferFrom('transferFrom', data);
      }
    }
  }

  setTransferFrom(kay, value) {
    this.transferForm.controls[kay].setValue(value);
    this.cashBalance = this.transferForm.get('transferFrom').value ? this.transferForm.get('transferFrom').value.cashAccountBalance : 0;
    this.transferForm.controls.transferTo.setValue(null);
    this.transferForm.controls.transferAmount.setValue("0");
    this.transferForm.get('transferAmount').enable();
    this.transferForm.controls.transferAll.setValue(false);
    this.isTransferAllChecked = false;
    this.destinationCashPortfolio(this.cashPortfolioList);
  }

  setTransferTo(kay, value) {
    this.transferForm.controls[kay].setValue(value);
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  TransferAllChecked() {
    if (this.transferForm.controls.transferAll.value && this.transferForm.controls.transferFrom.value) {
      const cashBalance = this.transferForm.get('transferFrom').value.cashAccountBalance ? this.transferForm.get('transferFrom').value.cashAccountBalance.toString() : this.transferForm.get('transferFrom').value.accountBalance.toString();
      this.transferForm.controls.transferAmount.setValue(this.decimalPipe.transform(cashBalance, '1.2-2').replace(/,/g, ''));
      this.transferForm.get('transferAmount').disable();
      this.isTransferAllChecked = true;
    } else {
      this.transferForm.controls.transferAmount.setValue("0");
      this.transferForm.get('transferAmount').enable();
      this.isTransferAllChecked = false;

    }
  }

  goToNext(From) {
    this.showConfirmTransferModal(From);
  }

  showConfirmTransferModal(form) {
    const ref = this.modal.open(TransferModalComponent, {
      centered: true
    });
    ref.componentInstance.transferFrom = this.transferForm.get('transferFrom').value;
    ref.componentInstance.transferTo = this.transferForm.get('transferTo').value;
    ref.componentInstance.TransferAmount = this.transferForm.get('transferAmount').value;
    ref.componentInstance.afterTransfer = this.cashBalance - this.transferForm.controls.transferAmount.value;
    ref.componentInstance.confirmed.subscribe(() => {
      ref.close();
      this.manageInvestmentsService.setTransferFormData(form.getRawValue(), this.isTransferAllChecked);
      this.saveTransfer()
    });
    this.dismissPopup(ref);
  }

  dismissPopup(ref: NgbModalRef) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        ref.close();
      }
    });
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

  saveTransfer() {
    if (!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant('TRANSFER.TRANSFER_REQUEST_LOADER.TITLE'),
        desc: this.translate.instant('TRANSFER.TRANSFER_REQUEST_LOADER.DESC')
      });
      this.manageInvestmentsService.TransferCash(this.formValues).subscribe((response) => {
        this.isRequestSubmitted = false;
        this.loaderService.hideLoader();
        if (response.responseMessage.responseCode < 6000) {
          if (response &&
            response.objectList &&
            response.objectList.serverStatus &&
            response.objectList.serverStatus.errors &&
            response.objectList.serverStatus.errors[0].code &&
            response.objectList.serverStatus.errors[0].code === 'CT-14'
          ) {
            this.showCustomErrorModal(
              'Error!',
              this.translate.instant('TRANSFER.SERVICE_NOT_AVAILABLE')
            );
          }
          else if (response &&
            response.objectList &&
            response.objectList.serverStatus &&
            response.objectList.serverStatus.errors &&
            response.objectList.serverStatus.errors[0]) {
            this.showCustomErrorModal(
              'Error!',
              response.objectList.serverStatus.errors[0].msg
            );
          } else if (response.responseMessage && response.responseMessage.responseDescription) {
            const errorResponse = response.responseMessage.responseDescription;
            this.showCustomErrorModal('Error!', errorResponse);
          } else {
            this.investmentAccountService.showGenericErrorModal();
          }
        } else {
          this.manageInvestmentsService.clearSetTransferData();
          this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TRANSFER_SUCCESS]);
        }
      },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        }
      );
    }
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }
}
