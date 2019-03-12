import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';

@Component({
  selector: 'app-additional-declaration-info',
  templateUrl: './additional-declaration-info.component.html',
  styleUrls: ['./additional-declaration-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalDeclarationInfoComponent implements OnInit {
  pageTitle: string;
  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {});
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(false);
  }
  goNext() {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION_STEP1]);
  }
}
