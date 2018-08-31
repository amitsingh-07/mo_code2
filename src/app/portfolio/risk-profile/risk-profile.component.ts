import { Component, OnInit } from '@angular/core';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from './../portfolio.service';

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss']
})
export class RiskProfileComponent implements OnInit {

  constructor(public readonly translate: TranslateService, private router: Router,
    public headerService: HeaderService,
    private portfolioService: PortfolioService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      
    });
  }

  ngOnInit() {
  }
  goToNext(form) {
    this.portfolioService.setPortfolioRecommendationModalCounter(0);
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.PORTFOLIO_RECOMMENDATION])

  }

}
