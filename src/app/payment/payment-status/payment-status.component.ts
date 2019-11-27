import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { APP_ROUTES } from './../../app-routes.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from './../../sign-up/sign-up.routes.constants';
import { PaymentStatus } from './../payment-status';

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

  public SUCCESS_TITLE = 'Yay! Payment Successful!';
  public SUCCESS_TEXT = 'Congratulations on taking a positive step towards your financial health. Your client adviser will be in touch with you soon.<br/><br/>You may view your payment status/receipt at XXXX.';
  public FAIL_TITLE = 'Oh no, payment failed…';
  public FAIL_TEXT = 'Looks like your payment did not go through. You can try again or you can contact our customer support.';
  public BACK_DASHBOARD = 'Back to Dashboard';
  public GO_HOME = 'Go to Home';
  public TRY_AGAIN = 'Try Again';

  public paymentStatus = 'success';

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public navbarService: NavbarService,
    private route: ActivatedRoute
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.navbarService.setNavbarMobileVisibility(false);
    document.body.classList.add('bg-color');

    this.route.queryParams.subscribe((params) => {
      if (params['state'] === PaymentStatus.SUCCESS) {
        this.statusTitle = this.SUCCESS_TITLE;
        this.statusText = this.SUCCESS_TEXT;
        this.btnText = this.BACK_DASHBOARD;
        this.navigateText = this.GO_HOME;
        this.paymentStatus = PaymentStatus.SUCCESS;
      } else {
        this.statusTitle = this.FAIL_TITLE;
        this.statusText = this.FAIL_TEXT;
        this.btnText = this.TRY_AGAIN;
        this.navigateText = this.BACK_DASHBOARD;
        this.paymentStatus = PaymentStatus.FAILED;
      }
    });
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-color');
  }

  onPressBtn() {
    if (this.paymentStatus === PaymentStatus.SUCCESS) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    } else {
      this.router.navigate(['/payment']);
    }
  }

  onPressNavigateText() {
    if (this.paymentStatus === PaymentStatus.SUCCESS) {
      this.router.navigate([APP_ROUTES.HOME]);
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    }
  }

}
