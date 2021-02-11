import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { PromoCodeService } from '../promo-code.service';
import { PROMO_CODE_STATUS, PROMO_ROUTE } from '../promo-code.constants';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../investment/manage-investments/manage-investments-routes.constants';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';

@Component({
  selector: 'app-promo-details',
  templateUrl: './promo-details.component.html',
  styleUrls: ['./promo-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PromoDetailsComponent implements OnInit {

  details: any;
  selectedPromo: any;
  usedPromo: any;
  promoCodeStatus: any;

  constructor(
    public activeModal: NgbActiveModal,
    public allModal: NgbModal,
    private translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private promoSvc: PromoCodeService,
    private manageInvestmentsService: ManageInvestmentsService) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.promoCodeStatus = PROMO_CODE_STATUS;
    this.selectedPromo = this.promoSvc.getSelectedPromo();
    this.usedPromo = this.promoSvc.usedPromo;
    this.promoSvc.fetchPromoListJSON().then((data) => {
      this.details = data.promoList.find(element => {
        if (this.selectedPromo['promoCode']) {
          return element['promoCode'] === this.selectedPromo['promoCode'];
        } else {
          return element['promoCode'] === this.selectedPromo['code'];
        }
      });
    });
  }

  close() {
    this.activeModal.dismiss();
  }

  usePromo(e) {
    if (this.selectedPromo['isWrapFeeRelated'] === 'Y') {
      const existingWrapFeePromo = this.promoSvc.checkForExistingWrapFee();
      if (existingWrapFeePromo) {
        this.openOverwriteModal(existingWrapFeePromo);
      } else {
        this.checkPath();
      }
    } else {
      this.checkPath();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  
  openOverwriteModal(existingPromo) {
    const ref = this.allModal.open(ModelWithButtonComponent, { centered: true, windowClass: 'cfm-overwrite-modal', backdrop: 'static' });
    const transformDate = this.datePipe.transform(existingPromo['promoCodeEndDate'], 'dd MMM y');
    ref.componentInstance.errorTitle = this.translate.instant('PROMO_CODE_OVERWRITE.OVERWRITE_TXT_1') 
    + existingPromo['wrapFeeDiscount'] * 100 + this.translate.instant('PROMO_CODE_OVERWRITE.OVERWRITE_TXT_2') 
    + transformDate +  this.translate.instant('PROMO_CODE_OVERWRITE.OVERWRITE_TXT_3');
    ref.componentInstance.yesOrNoButton = 'Yes';
    ref.componentInstance.isInlineButton = true;
    ref.componentInstance.yesClickAction.subscribe(() => {
      ref.close();
      // On yes click call API to update
      this.checkPath();
    });
    ref.componentInstance.noClickAction.subscribe(() => {
      this.promoSvc.removeAppliedPromo();
      ref.close();
    });
  }

  // Check if detail page is from where
  checkPath() {
    this.promoSvc.usedPromo.next(this.selectedPromo);
    if (this.router.url === PROMO_ROUTE) {
      if (this.selectedPromo['topupReq'] === 'Y') {
        this.navigateToTopUp();
      } else {
        this.promoSvc.savePromoCode(this.selectedPromo);
      }
    } else {
      // At top up/funding page, does not call API to save
      this.allModal.dismissAll();
    }
  }

  // Navigate to top up page
  navigateToTopUp() {
    this.allModal.dismissAll();
    this.manageInvestmentsService.getInvestmentOverview().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        const investmentoverviewlist = (data.objectList) ? data.objectList : {};
        const portfolioList = (investmentoverviewlist.portfolios) ? investmentoverviewlist.portfolios : [];
        this.manageInvestmentsService.setUserPortfolioList(portfolioList);
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
      }
    });
  }

  // Remove applied promo code
  removePromoCode(e) {
    this.promoSvc.removeAppliedPromo();
    this.activeModal.dismiss();
    e.preventDefault();
    e.stopPropagation();
  }
}
