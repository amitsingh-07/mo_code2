import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../manage-investments/manage-investments-routes.constants';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../../investment-common/investment-common.constants';

@Component({
  selector: 'app-cka-passed-result',
  templateUrl: './cka-passed-result.component.html',
  styleUrls: ['./cka-passed-result.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CkaPassedResultComponent implements OnInit {
  pageTitle: string;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private _location: Location,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    private investmentCommonService: InvestmentCommonService
  ) {
    this.translate.use('en');
   }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
  }
  goBack() {
    this._location.back();
  }

  goToNext() {
    const fromLocation = this.investmentCommonService.getCKARedirectFromLocation();
    if (fromLocation && fromLocation.includes(INVESTMENT_COMMON_CONSTANTS.CKA_REDIRECT_CONSTS.PROFILE)) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);      
    } else if (fromLocation && fromLocation.includes(INVESTMENT_COMMON_CONSTANTS.CKA_REDIRECT_CONSTS.PREREQUISITES)) {
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.CPF_PREREQUISITES]);      
    } else if (fromLocation && fromLocation.includes(INVESTMENT_COMMON_CONSTANTS.CKA_REDIRECT_CONSTS.TOPUP)) {
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);      
    }
  }
}
