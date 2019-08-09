import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService, IConfig } from '../../config/config.service';
import {
    ACCOUNT_CREATION_ROUTE_PATHS
} from '../account-creation-routes.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { AccountCreationService } from '../account-creation-service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StartComponent implements OnInit {
  singPassLinkTitle: any;
  formData: any;
  showSingPass: boolean;
  isInvestmentMyInfoEnabled = false;

  constructor(
    // tslint:disable-next-line
    private configService: ConfigService,
    public authService: AuthenticationService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private accountCreationService: AccountCreationService,
    private translate: TranslateService
  ) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {});

    this.translate.get('COMMON').subscribe((result: string) => {
      this.singPassLinkTitle = this.translate.instant('POSTLOGIN.PROCEED');
    });
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isInvestmentMyInfoEnabled = config.investmentMyInfoEnabled;
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.formData = this.accountCreationService.getInvestmentAccountFormData();
    this.showSingPass = this.formData.isMyInfoEnabled ? false : true;
  }
  goBack() {
    this._location.back();
  }
  myInfoManual() {
    this.accountCreationService.setMyInfoStatus(false);
    this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.SELECT_NATIONALITY]);
  }
}
