import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { appConstants } from './../app.constants';
import { ApiService } from '../shared/http/api.service';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';
import { PROMO_ROUTE, PROMO_CODE_STATUS, PROMO_JSON_URL, PROMO_MOCK_JSON } from './promo-code.constants';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from './../investment/manage-investments/manage-investments-routes.constants';
import { ManageInvestmentsService } from '../investment/manage-investments/manage-investments.service';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {

  private selectedPromo: any;
  public promoCodeWalletList: any;
  public promoJsonList: any;
  public usedPromo = new BehaviorSubject({});
  usedPromoObservable = this.usedPromo.asObservable();

  constructor(
    private apiService: ApiService,
    private navbarService: NavbarService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    public manageInvestmentsService: ManageInvestmentsService
  ) { }

  commit(key, data) {
    if (window.sessionStorage) {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  }

  setAppliedPromo(promo) {
    console.log('SETTING USER SELECTED PROMO =', promo)
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
    console.log('FIRST API CALL: getCustomerInvestmentPromoCode')
    const payload = {
      customerPromoCodeStatus: PROMO_CODE_STATUS.NOT_IN_USE.concat(',',PROMO_CODE_STATUS.PROCESSING).concat(',',PROMO_CODE_STATUS.APPLIED),
      promoCodeCategory: appConstants.INVESTMENT_PROMO_CODE_TYPE
    };
    return this.apiService.getCustomerInvestmentPromoCode(payload);
  }

    // API will check if promo is valid or invalid and return object if valid
  validatePromoCode(promoCode) {
    console.log('SECOND API CALL: validateInvestPromoCode')
    const payload = {
      promoCode: promoCode,
      promoCodeCategory: appConstants.INVESTMENT_PROMO_CODE_TYPE,
      profileType: 'public'
    };
    return this.apiService.validateInvestPromoCode(payload);
  }

  // Use the selected promo code
  useSelectedPromo(promo, currentUrl) {
    // Call savePromoCode
    console.log('USED PROMO =', promo)
    // Set the used promo
    this.usedPromo.next(promo);
    // Show overwrite pop if there is existing wrap fee applied
    if (this.selectedPromo['topupReq'] === 'Y') {
      // If required top up and user is not at top up or funding page
      if (currentUrl === PROMO_ROUTE) {
        // Need to retrieve investment portfolio list before navigating to top up page
        this.manageInvestmentsService.getInvestmentOverview().subscribe((data) => {
          if (data.responseMessage.responseCode >= 6000) {
            const investmentoverviewlist = (data.objectList) ? data.objectList : {};
            const portfolioList = (investmentoverviewlist.portfolios) ? investmentoverviewlist.portfolios : [];
            this.manageInvestmentsService.setUserPortfolioList(portfolioList);
            this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
          }
        });
        // this.addPromoToWallet(promo);
      } else {
        // Add promo to wallet and show applied toast
        // this.addPromoToWallet(promo);
        this.navbarService.showPromoAppliedToast();
      }
    } else {
      // Top up not required, is wrap fee related
      if (this.selectedPromo['isWrapFeeRelated'] === 'Y') {
        const existingWrapFeePromo = this.promoCodeWalletList.find((elem) => {
          if (elem['isWrapFeeRelated'] === 'Y' && elem['customerPromoStatus'] === PROMO_CODE_STATUS.APPLIED) {
            return elem;
          }
        });
        if (existingWrapFeePromo) {
          this.openOverwriteModal(existingWrapFeePromo, promo);
        } else {
          this.savePromoCode(promo);
        }
      } else {
        // After successful applied, call wallet list api again to get latest list
        this.savePromoCode(promo);
      }
    }
  }

  // This is to temporary add the promo to the wallet
  addPromoToWallet(promo) {
    promo['customerPromoStatus'] = PROMO_CODE_STATUS.PROCESSING;
    this.promoCodeWalletList.push(promo);
    console.log('ADDING PROMO TO WALLET =', this.promoCodeWalletList)
  }

  // API to update and overwrite existing wrap fee promo code
  // Change the status to applied
  savePromoCode(promo) {
    console.log('CALLING SAVE PROMO CODE!!!!', promo)
    const payload = {
      promoCodeId: promo.promoCodeId
    };
    this.navbarService.showPromoAppliedToast();
    // this.apiService.savePromoCode(payload).subscribe((data)=>{
    //   // Success
    //   if(data.responseMessage.responseCode > 6000) {
    //     this.navbarService.showPromoAppliedToast();
    //     // Call api to pull latest wallet list
    //     this.getPromoWallet().subscribe();
    //   }
    // })
  }

  openOverwriteModal(existingPromo, newPromo) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    const transformDate = this.datePipe.transform(existingPromo['promoCodeEndDate'], 'dd MMM y');
    ref.componentInstance.errorTitle = '<p>You have an existing promo code applied with ' + existingPromo['wrapFeeDiscount'] * 100 + '% off Advisory Fee till ' + transformDate + '</p>Would you like to proceed?';
    ref.componentInstance.yesOrNoButton = 'Yes';
    ref.componentInstance.isInlineButton = true;
    ref.componentInstance.yesClickAction.subscribe(() => {
      console.log('YES CLICKED')
      ref.close();
      // On yes click call API to update
      this.savePromoCode(newPromo);
      this.navbarService.showPromoAppliedToast();
    });
    ref.componentInstance.noClickAction.subscribe(() => {
      console.log('NO CLICKED')
      ref.close();
    });
  }
  // Fetch promo list json
  fetchPromoListJSON() {
    if (this.promoJsonList) {
      console.log('USING STORED PROMO LIST JSON', this.promoJsonList)
      return this.promoJsonList;
    } else {
      console.log('FETCHING PROMO LIST JSON')
      let url = PROMO_JSON_URL;
      return fetch(url)
        .then((response) => {
          this.promoJsonList = response.json();
          return this.promoJsonList;
        })
        .catch((error) => {
          console.log('Fail to fetch JSON from S3, error is ', error);
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
