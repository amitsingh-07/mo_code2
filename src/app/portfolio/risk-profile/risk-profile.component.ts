import { Component, OnInit } from '@angular/core';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from './../portfolio.service';
import { ProfileIcons } from './profileIcons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';

import { RiskProfile } from '../risk-profile/riskprofile';

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss']
})
export class RiskProfileComponent implements OnInit {
  iconImage;

  profileid: number;
  riskProfile: string;
  htmlDescription: string;

  selectedRiskProfile: RiskProfile
  formValues;

  constructor(public readonly translate: TranslateService, private router: Router,
    public headerService: HeaderService,
    private portfolioService: PortfolioService,
    private modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {

    });
  }

  ngOnInit() {
    this.selectedRiskProfile = this.portfolioService.getRiskProfile();
    this.iconImage = ProfileIcons[this.selectedRiskProfile.riskProfileId-1]['icon'];
  }
  goToNext() {
    this.portfolioService.setPortfolioRecommendationModalCounter(0);
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.PORTFOLIO_RECOMMENDATION])

  }

}
