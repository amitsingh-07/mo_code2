import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SignUpService } from 'src/app/sign-up/sign-up.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from './../../sign-up/sign-up.routes.constants';
import { PAYMENT_STATUS } from './../payment.constants';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentStatusComponent implements OnInit, OnDestroy {

  public statusTitle: string;
  public statusText: string;
  public btnText: string;
  public navigateText: string;

  public paymentStatus: string;
  private userEmail: any;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public navbarService: NavbarService,
    private route: ActivatedRoute,
    public signUpService: SignUpService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.navbarService.setNavbarMobileVisibility(false);
    document.body.classList.add('bg-color');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.route.queryParams.subscribe((params) => {
        this.setStatusText(params);
      });
    });
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-color');
  }

  // Set the various text for btn, status title and tex based on success or failed transaction
  setStatusText(params) {
    if (params['transaction_state'] === PAYMENT_STATUS.SUCCESS) {
      this.getUserEmail();
      this.statusTitle = this.translate.instant('PAYMENT_STATUS.SUCCESS_TITLE');
      this.statusText = this.translate.instant('PAYMENT_STATUS.SUCCESS_TEXT') + '<span>' + this.userEmail + '</span>';
      this.btnText = this.translate.instant('PAYMENT_STATUS.CONTINUE');
      this.paymentStatus = PAYMENT_STATUS.SUCCESS;
    } else {
      this.statusTitle = this.translate.instant('PAYMENT_STATUS.FAIL_TITLE');
      this.statusText = this.translate.instant('PAYMENT_STATUS.FAIL_TEXT');
      this.btnText = this.translate.instant('PAYMENT_STATUS.TRY_AGAIN');
      this.navigateText = this.translate.instant('PAYMENT_STATUS.BACK_DASHBOARD');
      this.paymentStatus = PAYMENT_STATUS.FAILED;
    }
  }

  // On press of CTA btn go to dashboard if success else back to checkout page if failed
  onPressBtn() {
    if (this.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    } else {
      this.router.navigate(['/payment/checkout']);
    }
  }

  // Show only when failed transaction, on press of navigate text go to dashboard
  onPressNavigateText() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  // Get user email for success transaction text display
  getUserEmail() {
    const userProfile = this.signUpService.getUserProfileInfo();
    if (userProfile) {
      this.userEmail = this.signUpService.getUserProfileInfo()['emailAddress'];
    }
  }
}
