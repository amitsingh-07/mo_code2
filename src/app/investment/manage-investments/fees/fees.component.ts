import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { ManageInvestmentsService } from '../manage-investments.service';
import { environment } from './../../../../environments/environment';
@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeesComponent implements OnInit {
  pageTitle: string;
  subTitle: string;
  feeDetails: any;
  userProfileInfo: any;

  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private translate: TranslateService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    public modal: NgbModal,
    private renderer: Renderer2,
    public manageInvestmentsService: ManageInvestmentsService,
    private signUpService: SignUpService
  ) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('FEES.TITLE');
      this.setPageTitle(this.pageTitle);
      this.renderer.addClass(document.body, 'portfolioname-bg');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(105);
    } else {
      this.navbarService.setNavbarMode(103);
    }
    this.footerService.setFooterVisibility(false);
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.getWrapFeeDetails(this.userProfileInfo.id);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  getWrapFeeDetails(customerId) {
    this.manageInvestmentsService.getWrapFeeDetails(customerId).subscribe((data) => {
      this.feeDetails = data.objectList;
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'portfolioname-bg');
  }
  getPromoCode(Value) {
    let maxLength = 35;
    return Value.length > maxLength ? Value.substr(0, maxLength) + '...' : Value;
  }
}



