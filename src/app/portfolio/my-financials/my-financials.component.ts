import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IMyFinancials } from './my-financials.interface';
import { AfterViewInit, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultFormatter, NouisliderComponent } from 'ng2-nouislider';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { PORTFOLIO_ROUTES, PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import {MyFinanacialFormError} from './my-financials-form-error';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';

import { portfolioConstants } from '../portfolio.constants'; 

@Component({
  selector: 'app-my-financials',
  templateUrl: './my-financials.component.html',
  styleUrls: ['./my-financials.component.scss']
})
export class MyFinancialsComponent implements OnInit {
  myFinancialsForm: FormGroup;
  myFinancialsFormValues: IMyFinancials;
  //private myFinanacialFormError =new MyFinanacialFormError();
  modalData: any;
  heplDate: any;



  pageTitle: string;
  constructor(
    private router: Router,
    private modal: NgbModal,
    private portfolioService: PortfolioService,
    private formBuilder: FormBuilder,
    public headerService: HeaderService,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    let self = this;
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
      monthlyIncome: new FormControl(this.myFinancialsFormValues.monthlyIncome, Validators.required),
      percentageOfSaving: new FormControl(this.myFinancialsFormValues.percentageOfSaving, Validators.required),
      totalAssets: new FormControl(this.myFinancialsFormValues.totalAssets, Validators.required),
      totalLiabilities: new FormControl(this.myFinancialsFormValues.totalLiabilities, Validators.required),
      initialInvestment: new FormControl(this.myFinancialsFormValues.initialInvestment, Validators.required),
      monthlyInvestment: new FormControl(this.myFinancialsFormValues.monthlyInvestment, Validators.required),
      suffEmergencyFund: new FormControl(portfolioConstants.my_financials.sufficient_emergency_fund, Validators.required)

    });
  }

  form: any;
  showEmergencyFundModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modalData.modalTitle;
    ref.componentInstance.errorMessage = this.modalData.modalMessage;
  }
  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.heplDate.modalTitle;
    ref.componentInstance.errorMessage = this.heplDate.modalMessage; return false;
  }

  save(form: any) {
    this.portfolioService.setMyFinancials(form.value);
    //CALL API

    this.authService.authenticate().subscribe((token) => {
      this.portfolioService.savePersonalInfo().subscribe((data) => {
        //capture enquiry id
      });
    });
    return true;
  }


  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP2]);
    }
  }
}