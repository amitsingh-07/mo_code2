import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../app.constants';
import { ApiService } from '../shared/http/api.service';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';
import { PROMO_CODE_STATUS, PROMO_PROFILE_TYPE, PROMO_JSON_URL, PROMO_MOCK_JSON } from './promo-code.constants';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {

  private selectedPromo: any;
  public promoCodeWalletList = new BehaviorSubject([]);
  public promoWalletObservable = this.promoCodeWalletList.asObservable();
  public promoJsonList: any;
  public usedPromo = new BehaviorSubject({});
  usedPromoObservable = this.usedPromo.asObservable();

  constructor(
    private apiService: ApiService,
    private navbarService: NavbarService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    public translate: TranslateService
  ) { }

  setAppliedPromo(promo) {
    this.selectedPromo = promo;
  }

  getSelectedPromo() {
    return this.selectedPromo;
  }

  removeAppliedPromo() {
    this.usedPromo.next({});
  }

  // API CALLS FOR PROMO CODE
  // API to get the list of promo codes for the user
  getPromoWallet() {
    const payload = {
      customerPromoCodeStatus: PROMO_CODE_STATUS.NOT_IN_USE.concat(',',PROMO_CODE_STATUS.PROCESSING).concat(',',PROMO_CODE_STATUS.APPLIED).concat(',',PROMO_CODE_STATUS.EXPIRED),
      promoCodeCategory: appConstants.INVESTMENT_PROMO_CODE_TYPE
    };
    return this.apiService.getCustomerInvestmentPromoCode(payload);
  }

    // API will check if promo is valid or invalid and return object if valid
  validatePromoCode(promoCode) {
    const payload = {
      promoCode: promoCode,
      promoCodeCategory: appConstants.INVESTMENT_PROMO_CODE_TYPE,
      profileType: PROMO_PROFILE_TYPE.PUBLIC
    };
    return this.apiService.validateInvestPromoCode(payload);
  }

   // API to update and overwrite existing wrap fee promo code
  savePromoCode(promo) {
    const payload = {
      promoCodeId: '' + promo.id
    };
    this.apiService.saveCustomerPromoCode(payload).subscribe((data) => {
      // Success
      if (data.responseMessage.responseCode === 6000) {
        this.modal.dismissAll();
        this.navbarService.showPromoAppliedToast();
        // Call api to pull latest wallet list
        this.getPromoWallet().subscribe((response) => {
          if (response && response['objectList']) {
            this.promoCodeWalletList.next(response['objectList']);
          }
          // After successfully applied remove the usedPromo
          this.removeAppliedPromo();
        });
      } else {
        this.openErrorModal();
      }
    })
  }
  // END API CALLS FOR PROMO CODE
  
  // Check for any existing wrap fee promo applied
  checkForExistingWrapFee() {
    return this.promoCodeWalletList.getValue().find((elem) => {
      if (elem['isWrapFeeRelated'] === 'Y' && (elem['customerPromoStatus'] === PROMO_CODE_STATUS.PROCESSING || elem['customerPromoStatus'] === PROMO_CODE_STATUS.APPLIED)) {
        return elem;
      }
    });
  }

  // Show overwrite existing wrap fee promo pop up
  openOverwriteModal(existingPromo, newPromo) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    const transformDate = this.datePipe.transform(existingPromo['promoCodeEndDate'], 'dd MMM y');
    ref.componentInstance.errorTitle = this.translate.instant('PROMO_CODE_OVERWRITE.OVERWRITE_TXT_1') 
    + existingPromo['wrapFeeDiscount'] * 100 + this.translate.instant('PROMO_CODE_OVERWRITE.OVERWRITE_TXT_2') 
    + transformDate +  this.translate.instant('PROMO_CODE_OVERWRITE.OVERWRITE_TXT_3');
    ref.componentInstance.yesOrNoButton = 'Yes';
    ref.componentInstance.isInlineButton = true;
    ref.componentInstance.yesClickAction.subscribe(() => {
      ref.close();
      // On yes click call API to update
      this.savePromoCode(newPromo);
    });
    ref.componentInstance.noClickAction.subscribe(() => {
      ref.close();
    });
  }

  openErrorModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('PROMO_CODE_ERROR.ERR_TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('PROMO_CODE_ERROR.ERR_MSG');
  }

  // Fetch promo list json
  fetchPromoListJSON() {
    if (this.promoJsonList) {
      return this.promoJsonList;
    } else {
      let url = PROMO_JSON_URL;
      return fetch(url)
        .then((response) => {
          this.promoJsonList = response.json();
          return this.promoJsonList;
        })
        .catch((error) => {
          this.getMockPromoListJson();
        });
    }
  }
  // Fetch app backup copy incase of failure to fetch from S3
  getMockPromoListJson() {
    fetch(PROMO_MOCK_JSON).then((data) => {
      this.promoJsonList = data.json();
      return this.promoJsonList;
    });
  }
}
