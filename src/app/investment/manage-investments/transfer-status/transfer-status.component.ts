import { Component, OnInit, ViewEncapsulation, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ManageInvestmentsService } from '../manage-investments.service';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from '../../../shared/navbar/navbar.service';

@Component({
  selector: 'app-transfer-status',
  templateUrl: './transfer-status.component.html',
  styleUrls: ['./transfer-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TransferStatusComponent implements OnInit {
  TransferEntityList: any;
  formValues: any;
  constructor(
    private router: Router,
    private manageInvestmentsService: ManageInvestmentsService,
    public readonly translate: TranslateService,
    public navbarService: NavbarService,
    private renderer: Renderer2,
  ) { this.translate.use('en'); }

  ngOnInit(): void {
    document.body.style.backgroundColor = "Lochinvar";
    this.navbarService.setNavbarVisibility(false);
    this.navbarService.setNavbarMode(10);
    this.navbarService.setNavbarMobileVisibility(false);
    this.renderer.addClass(document.body, 'transfer-body');
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.getTransferEntityList();
  }

  goToNext(value) {
    this.router.navigate([value]);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'transfer-body');
  }

  getTransferEntityList() {
    this.manageInvestmentsService.getTransferEntityList(this.formValues.selectedCustomerPortfolioId).subscribe((data) => {
      this.TransferEntityList = data.objectList;
    });
  }
}
