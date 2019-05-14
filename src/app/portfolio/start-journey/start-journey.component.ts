import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-start-journey',
  templateUrl: './start-journey.component.html',
  styleUrls: ['./start-journey.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StartJourneyComponent implements OnInit {
  pageTitle: string;
  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public headerService: HeaderService,
    private portfolioService: PortfolioService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private _location: Location,
    private modal: NgbModal
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = 'Welcome';
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);

    this.authService.authenticate().subscribe((token) => {
    });
    this.promoCodeForm = this.formBuilder.group({
      promoCode: [promoCodeValue, [Validators.pattern(RegexConstants.SixDigitPromo)]]
    });
  }

  @HostListener('input', ['$event'])
  onChange() {
    this.promoCodeRef.nativeElement.value = this.promoCodeRef.nativeElement.value.toUpperCase();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  goBack() {
    this._location.back();
  }
  goNext() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP1]);
  }

  verifyPromoCode(promoCode) {
    promoCode = promoCode.toUpperCase();
    this.isDisabled = true;
    this.willWritingApiService.verifyPromoCode(promoCode).subscribe((data) => {
      this.promoCode = data.responseMessage;
      if (this.promoCode.responseCode === 6005) {
        this.willWritingService.setPromoCode(promoCode);
        this.willWritingService.setEnquiryId(data.objectList[0].enquiryId);
        this.openTermsOfConditions();
      } else if (this.promoCode.responseCode === 5017) {
        this.willWritingService.openToolTipModal('', this.errorMsg);
        this.isDisabled = false;
      } else {
        this.isDisabled = false;
        return false;
      }
    }, (error) => {
      this.isDisabled = false;
    });
  }
}
