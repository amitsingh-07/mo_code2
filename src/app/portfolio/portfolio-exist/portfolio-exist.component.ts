import { Component, OnInit , ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PORTFOLIO_CONFIG } from '../../portfolio/portfolio.constants';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PORTFOLIO_ROUTE_PATHS, PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-portfolio-exist',
  templateUrl: './portfolio-exist.component.html',
  styleUrls: ['./portfolio-exist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioExistComponent implements OnInit {
  pageTitle: string;
  constructor(
    private router: Router,
    private portfolioService: PortfolioService,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = 'Portfolio Already Exist';
      this.setPageTitle(self.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
  }

}
