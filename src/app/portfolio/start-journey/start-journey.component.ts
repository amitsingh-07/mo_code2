import { Location } from '@angular/common';
import {
    Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
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
  isDisabled: boolean;
  promoCode;
  errorMsg: string;
  promoCodeForm: FormGroup;
  @ViewChild('promoCode') promoCodeRef: ElementRef;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private loaderService: LoaderService,
    private appService: AppService,
    public headerService: HeaderService,
    private portfolioService: PortfolioService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    private _location: Location,
    private formBuilder: FormBuilder,
    private modal: NgbModal
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('START.PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
      this.errorMsg = this.translate.instant('START.PROMO_ERROR');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);

    this.authService.authenticate().subscribe((token) => {
    });
    this.promoCodeForm = this.formBuilder.group({
      promoCode: ['', [Validators.pattern(RegexConstants.SixDigitPromo)]]
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
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
    if (this.promoCodeForm.controls.promoCode.value) {
      this.verifyPromoCode(this.promoCodeForm.controls.promoCode.value);
    } else {
      this.authService.saveEnquiryId(null);
      this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP1]);
    }
  }

  verifyPromoCode(promoCode) {
    this.loaderService.showLoader({
      title: this.translate.instant(
        'COMMON_LOADER.TITLE'
      ),
      desc: this.translate.instant(
        'COMMON_LOADER.DESC'
      )
    });
    promoCode = promoCode.toUpperCase();
    this.isDisabled = true;
    this.portfolioService.verifyPromoCode(promoCode).subscribe((data) => {
      this.loaderService.hideLoader();
      this.promoCode = data.responseMessage;
      if (this.promoCode.responseCode === 6005) {
        this.authService.saveEnquiryId(data.objectList[0].enquiryId);
        this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP1]);
      } else if (this.promoCode.responseCode === 5017) {
        this.showErrorModal();
        this.isDisabled = false;
      } else {
        this.isDisabled = false;
        return false;
      }
    }, (error) => {
      this.loaderService.hideLoader();
      this.isDisabled = false;
    });
  }

  showErrorModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = 'Error';
    ref.componentInstance.errorDescription = this.errorMsg;
    return false;
  }
}
