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
import { PortfolioService } from './../portfolio.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import {MyFinanacialFormError} from './my-financials-form-error';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-my-financials',
  templateUrl: './my-financials.component.html',
  styleUrls: ['./my-financials.component.scss']
})
export class MyFinancialsComponent implements OnInit {
  myFinancialsForm: FormGroup;
  myFinancialsFormValues: IMyFinancials;
  //private myFinanacialFormError =new MyFinanacialFormError();
  
  modalData : any;
    
  

  pageTitle: string;
  constructor(
    private router: Router,
    private modal: NgbModal,
    private portfolioService: PortfolioService,
    public headerService: HeaderService,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    let self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('GET_STARTED.TITLE');
      self.modalData = this.translate.instant('GET_STARTED.MODAL_VALUES');
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
      initialInvestment: new FormControl(this.myFinancialsFormValues.initialInvestment),
      monthlyInvestment: new FormControl(this.myFinancialsFormValues.monthlyInvestment),
      suffEmergencyFund: new FormControl(this.myFinancialsFormValues.suffEmergencyFund)

    });
  }

  form: any;
  popup() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    //ref.componentInstance.errorTitle = this.portfolioService.currentFormError(this.form)['errorTitle'];
    //ref.componentInstance.errorMessage = this.portfolioService.currentFormError(this.form)['errorMessage'];
    ref.componentInstance.errorTitle = this.modalData.modalTitle;
    ref.componentInstance.errorMessage = this.modalData.modalMessage;
    return false;
  }
  
  HelpModal(){
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    //ref.componentInstance.errorTitle = this.portfolioService.currentFormError(this.form)['errorTitle'];
    //ref.componentInstance.errorMessage = this.portfolioService.currentFormError(this.form)['errorMessage'];
    ref.componentInstance.errorTitle = this.modalData.modalTitle;
    ref.componentInstance.errorMessage = this.modalData.modalMessage;
    return false;
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