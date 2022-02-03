import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from 'src/app/shared/footer/footer.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from 'src/app/sign-up/sign-up.routes.constants';

@Component({
  selector: 'app-portfolio-application-inprogress',
  templateUrl: './portfolio-application-inprogress.component.html',
  styleUrls: ['./portfolio-application-inprogress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioApplicationInprogressComponent implements OnInit {

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private _location: Location,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService
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
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD])
  }

}
