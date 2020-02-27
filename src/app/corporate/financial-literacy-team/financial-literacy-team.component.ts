import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-financial-literacy-team',
  templateUrl: './financial-literacy-team.component.html',
  styleUrls: ['./financial-literacy-team.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FinancialLiteracyTeamComponent implements OnInit {

  public pageTitle: string;
  public people: any;
  isLoggedIn = false;

  constructor(private navbarService: NavbarService,
              private footerService: FooterService,
              public translate: TranslateService,
              private configService: ConfigService,
              private authService: AuthenticationService) {

    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });

    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('FINANCIAL_LITERACY_TEAM.TITLE');
      this.people = this.translate.instant('FINANCIAL_LITERACY_TEAM.PEOPLE.MGT');
    });

    if (this.authService.isSignedUser()) {
      this.isLoggedIn = true;
    }
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarVisibility(true);
    this.footerService.setFooterVisibility(true);
  }
}
