import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { InvestmentAccountFormData } from '../investment-account-form-data';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';


@Component({
  selector: 'app-additional-declaration-info',
  templateUrl: './additional-declaration-info.component.html',
  styleUrls: ['./additional-declaration-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalDeclarationInfoComponent implements OnInit {
  pageTitle: string;
  amlStatus: string;
  addInfoFormValues;
  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    private investmentAccountService: InvestmentAccountService,

  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }
  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.addInfoFormValues = this.investmentAccountService.getInvestmentAccountFormData();

  }

  setAdditionalScreenOneValues() {
    const data = {
      fName: '',
      lName: '',
      cName: '',
      pepoccupation: '',
      pepPostalCode: '',
      pepAddress1: '',
      pepAddress2: '',
      pepFloor: '',
      pepUnitNo: '',
      pepCity: '',
      pepState: '',
      pepZipCode: '',
    };
    this.investmentAccountService.setAdditionalInfoFormData(data);
  }

  goNext() {
    if (this.addInfoFormValues.pep) {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION_STEP1]);
    } else {
      this.setAdditionalScreenOneValues();
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2]);
    }

  }
}
