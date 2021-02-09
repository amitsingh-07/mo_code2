import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { PromoCodeService } from '../promo-code.service';
import { PROMO_CODE_STATUS, PROMO_ROUTE } from '../promo-code.constants';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../investment/manage-investments/manage-investments-routes.constants';

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
    this.promoSvc.usedPromo.next(this.selectedPromo);
    // Show overwrite pop if there is existing wrap fee applied
    if (this.selectedPromo['topupReq'] === 'Y') {
      // If required top up and user is not at top up or funding page
      if (this.router.url === PROMO_ROUTE) {
        // Need to retrieve investment portfolio list before navigating to top up page
       this.navigateToTopUp();
      } else {
        // On top up/funding page, dismiss the other modals
        this.allModal.dismissAll();
      }
    } else {
      // Top up not required, is wrap fee related
      if (this.selectedPromo['isWrapFeeRelated'] === 'Y') {
        const existingWrapFeePromo = this.promoSvc.checkForExistingWrapFee();
        if (existingWrapFeePromo) {
          this.promoSvc.openOverwriteModal(existingWrapFeePromo, this.selectedPromo);
        } else {
          this.checkPath();
        }
      } else {
        this.checkPath();
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }
  // Check if detail page is from where
  checkPath() {
    if (this.router.url === PROMO_ROUTE) {
      this.promoSvc.savePromoCode(this.selectedPromo);
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
