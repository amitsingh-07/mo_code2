import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from './../../../investment/investment-engagement-journey/investment-engagement-journey-routes.constants';
import { InvestmentAccountService } from '../../../investment/investment-account/investment-account-service';
import { InvestmentCommonService } from '../../../investment/investment-common/investment-common.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditInvestmentModalComponent } from '../../modal/edit-investment-modal/edit-investment-modal.component';
import { AuthenticationService } from '../../http/auth/authentication.service';
import {
  IInvestmentCriteria
} from '../../../investment/investment-common/investment-common-form-data';
@Component({
  selector: 'app-wise-income-fund',
  templateUrl: './wise-income-fund.component.html',
  styleUrls: ['./wise-income-fund.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WiseIncomeFundComponent implements OnInit {
  @Input() investmentData: any;
  // @Input() investmentCriteria: IInvestmentCriteria;
  @Input('portfolio') portfolio;
  @Input('investmentInput') investmentInput;
  investmentCriteria: IInvestmentCriteria;


  constructor(private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private investmentCommonService: InvestmentCommonService,
    public modal: NgbModal,
    public authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  goReviewInputs() {
    this.investmentAccountService.activateReassess();
    this.investmentCommonService.saveUpdateSessionData(this.portfolio);
    // this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
    this.getInvestmentCriteria(this.portfolio);
    this.openEditInvestmentModal();
  }
  openEditInvestmentModal() {
    const ref = this.modal.open(EditInvestmentModalComponent, {
      centered: true
    });
    ref.componentInstance.investmentData = {
      oneTimeInvestment: this.portfolio.initialInvestment,
      monthlyInvestment: this.portfolio.monthlyInvestment
    };
    ref.componentInstance.investmentCriteria = this.investmentCriteria;
    ref.componentInstance.modifiedInvestmentData.subscribe((emittedValue) => {
      // update form data
      ref.close();
      this.saveUpdatedInvestmentData(emittedValue);
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
  saveUpdatedInvestmentData(updatedData) {
    const params = this.constructUpdateInvestmentParams(updatedData);
    const customerPortfolioId = this.portfolio.customerPortfolioId;
    this.investmentAccountService.updateInvestment(customerPortfolioId, params).subscribe((data) => {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.PORTFOLIO_RECOMMENDATION]);
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  constructUpdateInvestmentParams(data) {
    return {
      initialInvestment: parseFloat(data.oneTimeInvestment),
      monthlyInvestment: parseFloat(data.monthlyInvestment),
      enquiryId: this.authService.getEnquiryId()
    };
  }
  getInvestmentCriteria(portfolioValues) {
    if (portfolioValues.portfolioType) {
      this.investmentCommonService.getInvestmentCriteria(portfolioValues.portfolioType).subscribe((data) => {
        this.investmentCriteria = data;
      });
    }
  }
}

