import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { PromoCodeService } from '../promo-code.service';
import { PAYMENT_CHECKOUT, PROMO_CODE_STATUS, PROMO_ROUTE } from '../promo-code.constants';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../investment/manage-investments/manage-investments-routes.constants';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { NtucMemberComponent } from '../ntuc-member/ntuc-member.component';
import { PAYMENT_ROUTE_PATHS } from '../../payment/payment-routes.constants';
import { LoaderService } from '../../shared/components/loader/loader.service';

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
  loading: any;

  constructor(
    public activeModal: NgbActiveModal,
    public allModal: NgbModal,
    private translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private promoSvc: PromoCodeService,
    private manageInvestmentsService: ManageInvestmentsService,
    private loaderService: LoaderService,) {
    this.translate.use('en');
    this.loading = this.translate.instant('COMMON_LOADER.TITLE');
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
    if (this.router.url === PAYMENT_CHECKOUT) {
      if (this.selectedPromo['isNTUCPromocode'] && !this.selectedPromo['isSPOrRobo2Customer']
        && !this.selectedPromo['isNTUCVerified']) {
        const ref = this.allModal.open(NtucMemberComponent,
          { centered: true, windowClass: 'cfm-overwrite-modal', backdrop: 'static' });
        ref.componentInstance.ntucMember.subscribe((form) => {
          ref.close();
          this.checkNtucMumber(form);
        });
      } else if (this.selectedPromo['isNTUCPromocode'] && this.selectedPromo['isSPOrRobo2Customer']
        && !this.selectedPromo['isNTUCVerified']) {
        this.showErrorPopup();
      }
      else if (this.selectedPromo['isNTUCPromocode'] && this.selectedPromo['isSPOrRobo2Customer']
        && this.selectedPromo['isNTUCVerified'] || !this.selectedPromo['isNTUCPromocode']) {         
        this.promoSvc.usedPromo.next(this.selectedPromo);
        if (this.selectedPromo && this.selectedPromo.promoCode) {
          this.promoSvc.setPromoCodeCpf(this.selectedPromo.promoCode);
        }
        this.promoSvc.tostMessage.next(true);
        this.allModal.dismissAll();
        this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]);
      } else {
        this.allModal.dismissAll();
        this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]);
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
    this.loaderService.showLoader({ title: this.loading, autoHide: false });
    this.promoSvc.checkNtucMumber(ntucForm).subscribe((data) => {
      this.loaderService.hideLoaderForced();
      if (data.responseMessage.responseCode === 6000 && data.objectList) {
        if (this.selectedPromo && this.selectedPromo.promoCode) {
          this.promoSvc.setPromoCodeCpf(this.selectedPromo.promoCode);
        }
        this.promoSvc.usedPromo.next(this.selectedPromo);
        this.promoSvc.tostMessage.next(true);
        this.allModal.dismissAll();
        this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]);
      } else {
        this.loaderService.hideLoaderForced();
        this.promoSvc.setPromoCodeCpf('');
        this.allModal.dismissAll();
        this.showErrorPopup();
      }
    });
  }

  showErrorPopup() {
    const ref = this.allModal.open(ModelWithButtonComponent, { centered: true, windowClass: 'ntuc-promo-error', backdrop: 'static' });
    ref.componentInstance.errorTitle = this.translate.instant('NTUC_MEMBER_PROMO.ERROR.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('NTUC_MEMBER_PROMO.ERROR.DESC');
    ref.componentInstance.primaryActionLabel = this.translate.instant('NTUC_MEMBER_PROMO.ERROR.BTN_LBL');
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
