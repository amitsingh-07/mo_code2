import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { PromoCodeService } from '../promo-code.service';
import { PROMO_CODE_STATUS, PROMO_ROUTE } from '../promo-code.constants';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../investment/manage-investments/manage-investments-routes.constants';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { NtucMemberComponent } from '../ntuc-member/ntuc-member.component';
import { PAYMENT_ROUTE_PATHS } from 'src/app/payment/payment-routes.constants';

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
  selectedPromoDetails: any;

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
    this.selectedPromoDetails = this.promoSvc.getPromoDetails();
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
    if (this.router.url === '/payment/checkout') {
      if (this.selectedPromo['isNTUCPromocode'] && this.selectedPromo['isSPOrRobo2Customer'] === false
        && this.selectedPromo['isNTUCVerified'] === false) {
        const ref = this.allModal.open(NtucMemberComponent,
          { centered: true, windowClass: 'cfm-overwrite-modal', backdrop: 'static' });
        ref.componentInstance.ntucMember.subscribe((form) => {
          ref.close();
          this.checkNtucMumber(form);
        });
      } else if (this.selectedPromo['isNTUCPromocode'] && this.selectedPromo['isSPOrRobo2Customer']
        && this.selectedPromo['isNTUCVerified'] === false) {
        this.showErrorPopup();
      } else{
         this.allModal.dismissAll();
      }
    }
    else {
      if (this.selectedPromo['isWrapFeeRelated'] === 'Y') {
        const existingWrapFeePromo = this.promoSvc.checkForExistingWrapFee();
        if (existingWrapFeePromo) {
          this.openOverwriteModal(existingWrapFeePromo);
        } else {
          this.checkPath();
        }
      }
      else {
        this.checkPath();
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }

  checkNtucMumber(ntucForm) {
    this.promoSvc.checkNtucMumber(ntucForm).subscribe((data) => {
      if (data.responseMessage.responseCode === 6000) {
        this.promoSvc.usedPromo.next(this.selectedPromo);
        this.allModal.dismissAll();
        this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]);            
      } else {
        this.allModal.dismissAll();
        this.showErrorPopup();
      }
    });
  }

  showErrorPopup() {
    const ref = this.allModal.open(ModelWithButtonComponent, { centered: true, windowClass: 'cfm-overwrite-modal', backdrop: 'static' });
    ref.componentInstance.errorTitle = "Sorry, we couldn’t find your NTUC Member";
    ref.componentInstance.errorMessage = "If your member mobile number is not updated, please update it via NTUC e-services and apply promo code again. For other enquiries, you may wish to contact us at enquiries@moneyowl.com.sg.";
    ref.componentInstance.primaryActionLabel = 'Back to Checkout';
    ref.componentInstance.primaryAction.subscribe(() => {
      this.allModal.dismissAll();
      this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]);
    });
  }

  openOverwriteModal(existingPromo) {
    const ref = this.allModal.open(ModelWithButtonComponent, { centered: true, windowClass: 'cfm-overwrite-modal', backdrop: 'static' });
    ref.componentInstance.errorTitle = this.translate.instant('PROMO_CODE_OVERWRITE.OVERWRITE_TXT_1')
      + existingPromo['wrapFeeDiscountMsg'] + this.translate.instant('PROMO_CODE_OVERWRITE.OVERWRITE_TXT_3');
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
