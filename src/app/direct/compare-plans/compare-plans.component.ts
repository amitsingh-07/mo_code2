import { CurrencyPipe, Location, TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ProductDetailComponent } from '../../shared/components/product-detail/product-detail.component';
import { HeaderService } from '../../shared/header/header.service';
import { DirectService } from './../direct.service';

@Component({
  selector: 'app-compare-plans',
  templateUrl: './compare-plans.component.html',
  styleUrls: ['./compare-plans.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TitleCasePipe]
})
export class ComparePlansComponent implements OnInit {
  pageTitle: string;
  plansData: any[] = [];
  cashValueTooltipData;
  underwritingTooltipData;
  frequencyFilter: string;
  protectionType: string;
  constructor(
    public headerService: HeaderService, public directService: DirectService,
    public readonly translate: TranslateService, private _location: Location,
    public titlecase: TitleCasePipe, private modal: NgbModal, private currency: CurrencyPipe) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('COMPARE_PLANS.TITLE');
      this.cashValueTooltipData = this.translate.instant('COMPARE_PLANS.CASH_VALUE_TOOLTIP');
      this.underwritingTooltipData = this.translate.instant('COMPARE_PLANS.NEED_UNDERWRITING_TOOLTIP');
      this.setPageTitle(this.pageTitle);
    });
    this.frequencyFilter = this.directService.getPremiumFrequencyFilter();
    this.protectionType = this.directService.getProtectionType();
  }

  ngOnInit() {
    this.plansData = this.directService.getSelectedPlans();
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  showCashValueTooltip() {
    this.directService.showToolTipModal(
      this.cashValueTooltipData['TITLE'], this.cashValueTooltipData['DESCRIPTION']);
  }

  showUnderwritingTooltip() {
    this.directService.showToolTipModal(
      this.underwritingTooltipData['TITLE'], this.underwritingTooltipData['DESCRIPTION']);
  }

  close() {
    this._location.back();
  }

  viewDetails(plan) {
    const ref = this.modal.open(ProductDetailComponent,
      {
        centered: true,
        windowClass: 'product-details-modal-dialog'
      }
    );
    ref.componentInstance.plan = plan;
    ref.componentInstance.isViewMode = true;
    ref.componentInstance.bestValue = plan.bestValue;
    ref.componentInstance.protectionType = this.protectionType;
  }
}
