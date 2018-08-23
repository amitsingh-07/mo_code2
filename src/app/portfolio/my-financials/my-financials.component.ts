import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IMyFinancials } from './my-financials.interface';
import { AfterViewInit,  HostListener,  ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultFormatter, NouisliderComponent } from 'ng2-nouislider';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder,  Validators } from '@angular/forms';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import {  PORTFOLIO_ROUTES, PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { PortfolioService} from './../portfolio.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-my-financials', 
  templateUrl: './my-financials.component.html',
  styleUrls: ['./my-financials.component.scss']
})
export class MyFinancialsComponent implements OnInit {
  myFinancialsForm: FormGroup;
  myFinancialsFormValues: IMyFinancials;
  
  pageTitle: string;
    constructor(
      private modal:NgbModal,
      private portfolioService:PortfolioService,
      public headerService: HeaderService,
      
      public readonly translate: TranslateService) {
      this.translate.use('en');
      this.translate.get('COMMON').subscribe((result: string) => {
        this.pageTitle = this.translate.instant('GET_STARTED.TITLE');
        this.setPageTitle(this.pageTitle);
      });
    }
    setPageTitle(title: string) {
      this.headerService.setPageTitle(title);
    }
  ngOnInit() {
    this.myFinancialsFormValues = this.portfolioService.getMyFinancials();
   
    this.myFinancialsForm = new FormGroup({
      monthlyIncome: new FormControl(this.myFinancialsFormValues.monthlyIncome),
      myIncomeSaved: new FormControl(this.myFinancialsFormValues.myIncomeSaved),
      totalAssets: new FormControl(this.myFinancialsFormValues.totalAssets),
      totalLoans: new FormControl(this.myFinancialsFormValues.totalLoans),
      initialDeposit: new FormControl(this.myFinancialsFormValues.initialDeposit),
      monthlyDeposit: new FormControl(this.myFinancialsFormValues.monthlyDeposit),
      suffEmergencyFund: new FormControl(this.myFinancialsFormValues.suffEmergencyFund)
      
  });
}

form: any;
popup(){
  // alert("hiii");
  const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.portfolioService.currentFormError(this.form)['errorTitle'];
      ref.componentInstance.errorMessage = this.portfolioService.currentFormError(this.form)['errorMessage'];
      return false;
 
}
}