import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from './../portfolio.service';


@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundDetailsComponent implements OnInit {
  portfolio:any;
  name:string;
  pageTitle:string;
  constructor(public readonly translate: TranslateService,
     private router: Router,
    public headerService: HeaderService,
    private portfolioService: PortfolioService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('FUND_DETAILS.TITLE');
     
     
      this.setPageTitle(this.pageTitle, null, false);
    });
  }
  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }
  ngOnInit() {
    this.getPortfolioAllocationDeatails();
  }
  getPortfolioAllocationDeatails() {
   this.portfolioService.getPortfolioAllocationDeatails().subscribe((data) => {
      this.portfolio = data.objectList;
      console.log(this.portfolio);
    
    });
  }

}








