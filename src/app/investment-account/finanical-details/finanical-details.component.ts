
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

import { PortfolioService } from '../../portfolio/portfolio.service';

import { PortfolioFormData } from '../../portfolio/portfolio-form-data';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-finanical-details',
  templateUrl: './finanical-details.component.html',
  styleUrls: ['./finanical-details.component.scss']
})
export class FinanicalDetailsComponent implements OnInit {
  pageTitle: string;
  financialDetails: FormGroup;
  formValues;
  annualHouseHoldIncomeRange: any;
  numberOfHouseHoldMembers: string;
  annualHouseHoldIncomeRanges: any =
    [
      '$2,000',
      '$2,001 to $4,000',
      '$4,001 to $6,000',
      '$6,001 to $8,000',
      '$8,001 to $10,000',
      '$10,001 to $12,000',
      '$12,001 to $14,000',
      '$14,000 to $16,000',
      '$16,001 to $18,000',
      'Above $18,001'];
  numberOfHouseHoldMembersList = Array(11).fill(0).map((x, i) => i);

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    public portfolioService: PortfolioService,
    

    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('FINANCIIAL_DETAILS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.formValues = this.portfolioService.getMyFinancials();
    this.financialDetails = this.formBuilder.group({
      monthlyIncome: ['3123', Validators.required],
      percentageOfSaving: ['43gfd24', Validators.required],
      totalAssets: ['3gdf234', Validators.required],
      totalLiabilities: ['3fg243', Validators.required],
    });
  }
  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }
  setAnnualHouseHoldIncomeRange(annualHouseHoldIncome) {
    this.annualHouseHoldIncomeRange = annualHouseHoldIncome;
  }
  setnumberOfHouseHoldMembers(HouseHoldMembers) {
    this.numberOfHouseHoldMembers = HouseHoldMembers;
  }

}
