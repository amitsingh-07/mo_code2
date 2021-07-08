import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../app.constants';
import { ApiService } from '../shared/http/api.service';
import { NavbarService } from '../shared/navbar/navbar.service';
import { PROMO_CODE_STATUS, PROMO_PROFILE_TYPE, PROMO_MOCK_JSON } from './promo-code.constants';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {
  private selectedPromo: any;
  private promoDetails: any;
  public promoCodeWalletList = new BehaviorSubject([]);
  public promoWalletObservable = this.promoCodeWalletList.asObservable();
  public promoJsonList: any;
  public usedPromo = new BehaviorSubject({});
  usedPromoObservable = this.usedPromo.asObservable();
  public tostMessage = new Subject();
  public clearInput = new BehaviorSubject(false);

  constructor(
    private apiService: ApiService,
    private navbarService: NavbarService,
    private modal: NgbModal,
    public translate: TranslateService
  ) { }

  setAppliedPromo(promo) {
    this.selectedPromo = promo;
  }

  getSelectedPromo() {
    return this.selectedPromo;
  }

  setPromoDetails(promoDetails){
    this.promoDetails = promoDetails;
  }
  
  getPromoDetails() {
    return this.promoDetails;
  }

  removeAppliedPromo() {
    this.usedPromo.next({});
    this.clearInput.next(true);
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
      promoCodeCategory:appConstants.INVESTMENT_PROMO_CODE_TYPE,
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
      if (elem['isWrapFeeRelated'] === 'Y' && (elem['customerPromoStatusDisp'].toUpperCase() === PROMO_CODE_STATUS.PROCESSING || elem['customerPromoStatusDisp'].toUpperCase() === PROMO_CODE_STATUS.APPLIED)) {
        return elem;
      }
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
      console.log(this.promoJsonList  +"promoJsonList");
      return this.promoJsonList;
    } else {
      let url = environment.promoCodeJsonUrl;
      return fetch(url)
        .then((response) => {
          this.promoJsonList = response.json();
           console.log(this.promoJsonList  +"promoJsonList");
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

  checkNtucMumber(ntucForm) {
    const payload = {
      lastFourCharOfNricNumber: ntucForm.nricOrFin,
      mobileNumber: ntucForm.mobileNumber,
      dob: ntucForm.dob
    };
    return this.apiService.checkNtucMumber(payload);
  }

  validateCpfPromoCode(promoCode) {
    const payload = {
      promoCode: promoCode,
      promoCodeCategory:appConstants.COMPREHENSIVE_PROMO_CODE_TYPE,
      profileType: PROMO_PROFILE_TYPE.PUBLIC.toUpperCase()   
    };
   return this.apiService.validateCpfPromoCode(payload); 
  }

}
