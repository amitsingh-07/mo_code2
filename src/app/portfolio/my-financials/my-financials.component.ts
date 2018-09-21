import { DefaultFormatter, NouisliderComponent } from 'ng2-nouislider';

import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  AfterViewInit, Component, HostListener, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PORTFOLIO_CONFIG } from '../../portfolio/portfolio.constants';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { PORTFOLIO_ROUTE_PATHS, PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';
import { FinancialValidator } from './my-financial-validator';
import { IMyFinancials } from './my-financials.interface';

import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
@Component({
  selector: 'app-my-financials',
  templateUrl: './my-financials.component.html',
  styleUrls: ['./my-financials.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyFinancialsComponent implements IPageComponent, OnInit {
  myFinancialsForm: FormGroup;
  myFinancialsFormValues: IMyFinancials;
  modalData: any;
  heplDate: any;
  pageTitle: string;
  form: any;

  constructor(
    private router: Router,
    private modal: NgbModal,
    private portfolioService: PortfolioService,
    private formBuilder: FormBuilder,
    public headerService: HeaderService,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('MY_FINANCIALS.TITLE');
      self.modalData = this.translate.instant('MY_FINANCIALS.modalData');
      self.heplDate = this.translate.instant('MY_FINANCIALS.heplDate');
      this.setPageTitle(self.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }
  ngOnInit() {
    this.myFinancialsFormValues = this.portfolioService.getMyFinancials();

    this.myFinancialsForm = new FormGroup({
      monthlyIncome: new FormControl(this.myFinancialsFormValues.monthlyIncome),
      percentageOfSaving: new FormControl(this.myFinancialsFormValues.percentageOfSaving),
      totalAssets: new FormControl(this.myFinancialsFormValues.totalAssets),
      totalLiabilities: new FormControl(this.myFinancialsFormValues.totalLiabilities),
      initialInvestment: new FormControl(this.myFinancialsFormValues.initialInvestment, Validators.required),
      monthlyInvestment: new FormControl(this.myFinancialsFormValues.monthlyInvestment),
      suffEmergencyFund: new FormControl(PORTFOLIO_CONFIG.my_financials.sufficient_emergency_fund)

    });
  }

  showEmergencyFundModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modalData.modalTitle;
    ref.componentInstance.errorMessage = this.modalData.modalMessage;
  }
  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.heplDate.modalTitle;
    ref.componentInstance.errorDescription = this.heplDate.modalDesc;
    return false;
  }

  goToNext(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
    }
    const error = this.portfolioService.doFinancialValidations(form);
    console.log('error' + error);
    console.log(form.value);
    if (error) {
      // tslint:disable-next-line:no-commented-code
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      // tslint:disable-next-line:triple-equals
      if (error.errorTitle == 'Information') {
        ref.componentInstance.secondButton = 'Yes';
        ref.componentInstance.secondButtonTitle = 'No';
        ref.componentInstance.ButtonTitle = 'Yes';
        ref.componentInstance.yesButtonClick.subscribe((emittedValue) => {
          // tslint:disable-next-line:triple-equals
          if (emittedValue == 'No') {
            return false;
          } else {
            this.saveAndProceed(form);
          }
        });
      } else {
        ref.componentInstance.ButtonTitle = 'Try Again';
        return false;
      }
    } else {

      this.saveAndProceed(form);
    }
  }
  saveAndProceed(form: any) {
    this.portfolioService.setMyFinancials(form.value);
    // CALL API
    this.portfolioService.savePersonalInfo().subscribe((data) => {
      if (data) {
        this.authService.saveEnquiryId(data.objectList.enquiryId);
        this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP2]);
      }
    });
  }
}
