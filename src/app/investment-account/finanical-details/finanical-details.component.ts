import { CommonModule, CurrencyPipe } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from '../../shared/navbar/navbar.service';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

import { PortfolioService } from '../../portfolio/portfolio.service';

import { PortfolioFormData } from '../../portfolio/portfolio-form-data';

@Component({
  selector: 'app-finanical-details',
  templateUrl: './finanical-details.component.html',
  styleUrls: ['./finanical-details.component.scss']
})
export class FinanicalDetailsComponent implements OnInit {
  pageTitle: string;
  financialDetails: FormGroup;
  FinancialFormData;
  selectRangeValue = 'select Range';
  selectNumber = 'Select Number';
  formValues;
  annualHouseHoldIncomeRange: any;
  numberOfHouseHoldMembers: string;
  annualHouseHoldIncomeRanges: any;
  numberOfHouseHoldMembersList = Array(11).fill(0).map((x, i) => i);

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    public portfolioService: PortfolioService,
    public navbarService: NavbarService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('FINANCIAL_DETAILS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.getIncomeRangeList();
    this.FinancialFormData = this.portfolioService.getMyFinancials();
    this.formValues = this.investmentAccountService.getFinancialFormData();
    this.financialDetails = this.formBuilder.group({
      annualHouseHoldIncomeRange: [this.formValues.annualHouseHoldIncomeRange, Validators.required],
      numberOfHouseHoldMembers: [this.formValues.numberOfHouseHoldMembers, Validators.required],
      financialMonthlyIncome: [this.formValues.financialMonthlyIncome ?
        this.formValues.financialMonthlyIncome : this.FinancialFormData.monthlyIncome,
        Validators.required],
      financialPercentageOfSaving: [this.formValues.financialPercentageOfSaving
        ? this.formValues.financialPercentageOfSaving : this.FinancialFormData.percentageOfSaving,
      Validators.required],
      financialTotalAssets: [this.formValues.financialTotalAssets
        ? this.formValues.financialTotalAssets : this.FinancialFormData.totalAssets,
      Validators.required],
      financialTotalLiabilities: [this.formValues.financialTotalLiabilities
        ? this.formValues.financialTotalLiabilities :
        this.FinancialFormData.totalLiabilities,
      Validators.required]
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  getIncomeRangeList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.annualHouseHoldIncomeRanges = data.objectList.incomeRange;
      console.log(this.annualHouseHoldIncomeRanges);
    });
  }
  setAnnualHouseHoldIncomeRange(annualHouseHoldIncome) {
    this.selectRangeValue = annualHouseHoldIncome.name;
    this.financialDetails.controls['annualHouseHoldIncomeRange'].setValue(this.selectRangeValue);

  }
  setnumberOfHouseHoldMembers(HouseHoldMembers) {
    this.selectNumber = HouseHoldMembers;
    this.financialDetails.controls['numberOfHouseHoldMembers'].setValue(this.selectNumber);
  }
  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }
  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }
  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.investmentAccountService.setFinancialFormData(form.value);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.TAX_INFO]);
    }
  }

}
