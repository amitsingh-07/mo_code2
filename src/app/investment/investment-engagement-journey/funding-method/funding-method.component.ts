import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';

@Component({
  selector: 'app-funding-method',
  templateUrl: './funding-method.component.html',
  styleUrls: ['./funding-method.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundingMethodComponent implements OnInit {

  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    private _location: Location,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    public signUpService: SignUpService,
    private investmentAccountService: InvestmentAccountService
  ){
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      
    });
  }

  ngOnInit() {
  }
  goToNext(){
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  }
}
