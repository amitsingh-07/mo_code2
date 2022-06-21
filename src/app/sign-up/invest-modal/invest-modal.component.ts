import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { InvestmentEngagementJourneyService } from '../../investment/investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment/investment-engagement-journey/investment-engagement-journey.constants';
import { InvestmentCommonService } from '../../investment/investment-common/investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../../investment/investment-engagement-journey/investment-engagement-journey-routes.constants';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../investment/manage-investments/manage-investments-routes.constants';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';

@Component({
  selector: 'app-invest-modal',
  templateUrl: './invest-modal.component.html',
  styleUrls: ['./invest-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvestModalComponent implements OnInit {
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  innerWidth: number;
  mobileThreshold = 567;

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    public authService: AuthenticationService,
    private investmentCommonService: InvestmentCommonService,
    public manageInvestmentsService: ManageInvestmentsService,
    private investmentEngagementService: InvestmentEngagementJourneyService) {}

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.innerWidth = window.innerWidth;
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      if (innerWidth > this.mobileThreshold) {
        this.activeModal.close();
      }
    })
  }

  newPortfolio() {
    this.authService.removeEnquiryId();
    this.investmentCommonService.clearFundingDetails();  
    this.investmentCommonService.clearJourneyData();
    if (this.authService.accessCorporateUserFeature('CREATE_JOINT_ACCOUNT')) {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO_TYPE]);
    } else {
      this.investmentEngagementService.setUserPortfolioType(INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.PERSONAL_ACCOUNT_ID);
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
    }
    this.activeModal.close();
  }

  existingPortfolio() {
    this.manageInvestmentsService.setSelectedCustomerPortfolioId(null);
    this.manageInvestmentsService.setSelectedCustomerPortfolio(null);
    this.manageInvestmentsService.getInvestmentOverview().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        const investmentoverviewlist = (data.objectList) ? data.objectList : {};
        const portfolioList = (investmentoverviewlist.portfolios) ? investmentoverviewlist.portfolios : [];
        this.manageInvestmentsService.setUserPortfolioList(portfolioList);
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
      }
    });
    this.activeModal.close();
  }
  
}
