import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from '../../shared/http/api.service';
import { InvestmentAccountFormData } from '../investment-account/investment-account-form-data';

import { InvestmentApiService } from '../investment-api.service';
import {
    InvestmentEngagementJourneyService
} from '../investment-engagement-journey/investment-engagement-journey.service';





const SESSION_STORAGE_KEY = 'app_withdraw-session';
@Injectable({
  providedIn: 'root'
})
export class InvestmentCommonService {
 constructor(
    private investmentApiService: InvestmentApiService
  ) {
  }
  addPortfolioName(data) {
    return this.investmentApiService.addPortfolioName(data);
  }

  confirmPortfolio() {
    return this.investmentApiService.confirmPortfolio();
  }
}
