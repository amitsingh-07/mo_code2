import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { ManageInvestmentsService } from '../manage-investments.service';


@Component({
  selector: 'app-dividend-payout',
  templateUrl: './dividend-payout.component.html',
  styleUrls: ['./dividend-payout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DividendPayoutComponent implements OnInit {

  pageTitle: string;
  portfolio: any;
  formValues: any;
  dividentList: any;
  portfolioName: any;

  constructor(
    private router: Router,
    public footerService: FooterService,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private renderer: Renderer2,
    public manageInvestmentsService: ManageInvestmentsService
  ) {
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.portfolio = this.formValues.selectedCustomerPortfolio.portfolioName;
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('DIVIDEND.TITLE');
      this.portfolioName = this.translate.instant(this.portfolio);
      this.setPageTitle(this.pageTitle);
    });
    this.renderer.addClass(document.body, 'portfolioname-bg');
  }

  ngOnInit(): void {
    this.dividentList = this.formValues.selectedCustomerPortfolio.dividentPayoutOrReInvestList;
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title, null, null, false, false, this.portfolio, false);
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'portfolioname-bg');
  }
}
