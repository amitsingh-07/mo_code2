import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { AccountCreationFormData } from '../account-creation-form-data';
import { ACCOUNT_CREATION_ROUTE_PATHS } from '../account-creation-routes.constants';
import { AccountCreationService } from '../account-creation-service';


@Component({
  selector: 'app-additional-declaration-info',
  templateUrl: './additional-declaration-info.component.html',
  styleUrls: ['./additional-declaration-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalDeclarationInfoComponent implements OnInit {
  pageTitle: string;
  addInfoFormValues;
  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    private accountCreationService: AccountCreationService,

  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }
  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.addInfoFormValues = this.accountCreationService.getInvestmentAccountFormData();

  }
  goNext() {
    if (this.addInfoFormValues.pep) {
      this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.ADDITIONALDECLARATION_STEP1]);
    } else {
      this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2]);
    }

  }
}
