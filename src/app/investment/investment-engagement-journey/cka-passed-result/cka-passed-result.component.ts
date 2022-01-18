import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';

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
    const redirectURL = this.investmentCommonService.getCKARedirectFromLocation();
    this.router.navigate([redirectURL]);
  }
}
