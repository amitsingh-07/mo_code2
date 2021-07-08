import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NavbarService } from './../../shared/navbar/navbar.service';
import { PromoDetailsComponent } from './../promo-details/promo-details.component';
import { PromoCodeService } from './../promo-code.service';
import { PAYMENT_CHECKOUT, PROMO_CODE_STATUS } from './../promo-code.constants';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from './../../investment/manage-investments/manage-investments-routes.constants';


@Component({
  selector: 'app-promo-code-list',
  templateUrl: './promo-code-list.component.html',
  styleUrls: ['./promo-code-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PromoCodeListComponent implements OnInit {

  formGrp: FormGroup;

  showClearBtn: boolean = false;
  showSpinner: boolean = false;
  promoCodeValidated: boolean = false;
  showError: boolean = false;
  promoArray = [];
  promoCodeStatus: any;

  constructor(
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public navbarService: NavbarService,
    private promoSvc: PromoCodeService,
    private router: Router,
    private modal: NgbModal) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.promoCodeStatus = PROMO_CODE_STATUS;
    this.formGrp = this.formBuilder.group({
      promoCode: ['', [Validators.required]]
    });
    // 
    if (this.router.url !== PAYMENT_CHECKOUT) {
      this.getPromoWallet();  // i add condition
    }
    // Fetch the promo list json
    this.promoSvc.fetchPromoListJSON();
    // Set the new promo list when any changes to the promo wallet
    this.promoSvc.promoWalletObservable.subscribe((data) => {
      this.promoArray = data;
    });

    this.promoSvc.clearInput.subscribe((data) => {
      this.clearPromoCode();
    })
  }
  getPromoWallet() {
    this.promoSvc.getPromoWallet().subscribe((response) => {
      if (response && response['objectList']) {
        this.promoArray = response['objectList'];
        this.promoSvc.promoCodeWalletList.next(response['objectList']);
      }
      // Error
    });
  }

  onKeyupEvent(event) {
    if (event.target.value) {
      if (!this.showSpinner) {
        this.showClearBtn = true;
      } else {
        this.showClearBtn = false;
      }
    } else {
      this.showClearBtn = false;
    }
  }

  applyPromoCode(event) {
    if (this.formGrp.controls['promoCode'].value.length === 6) {
      // Show the spinner
      this.formGrp.controls['promoCode'].setErrors(null);
      this.showClearBtn = false;
      this.showSpinner = true;
      this.showError = false;    
       if (this.router.url === PAYMENT_CHECKOUT) {
        this.validateCpfPromoCode();
      } else {
        this.validateInvestPromoCode();
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  validateInvestPromoCode() {
    this.promoSvc.validatePromoCode(this.formGrp.controls['promoCode'].value).subscribe((response) => {
      // Success
      const responseCode = response.responseMessage['responseCode'];
      if (responseCode === 6005) {
        setTimeout(() => {
          this.showSpinner = false;
          this.showClearBtn = true;
          this.showDetails(response['objectList'][0]);
        }, 1200);
      } else {
        setTimeout(() => {
          this.showSpinner = false;
          this.showClearBtn = true;
          this.showError = true;
          // Show different error codes
          if (responseCode === 5025) {
            this.formGrp.controls['promoCode'].setErrors({ promoCodeAlreadyApplied: true });
          } else if (responseCode === 5026) {
            this.formGrp.controls['promoCode'].setErrors({ existingPromoCode: true });
          } else if (responseCode === 5029) {
            this.formGrp.controls['promoCode'].setErrors({ noExistingPortfolio: true });
          } else {
            this.formGrp.controls['promoCode'].setErrors({ invalidPromoCode: true });
          }
        }, 1200);
      }
    });
  }

  validateCpfPromoCode() {
    this.promoSvc.validateCpfPromoCode(this.formGrp.controls['promoCode'].value).subscribe((response) => {
      // Success
      const responseCode = response.responseMessage['responseCode'];
      if (responseCode === 6005 || responseCode === 5032) {
        setTimeout(() => {
          this.showSpinner = false;
          this.showClearBtn = true;
          this.showDetails(response['objectList'][0]);
        }, 1200);
      } else {
        setTimeout(() => {
          this.showSpinner = false;
          this.showClearBtn = true;
          this.showError = true;
          // Show different error codes
          if (responseCode === 5025) {
            this.formGrp.controls['promoCode'].setErrors({ promoCodeAlreadyApplied: true });
          } else if (responseCode === 5026) {
            this.formGrp.controls['promoCode'].setErrors({ existingPromoCode: true });
          } else  {
            this.formGrp.controls['promoCode'].setErrors({ invalidPromoCode: true });
          }
        }, 1200);
      }
    });
  }

  clearPromoCode(event?) {
    this.formGrp.controls['promoCode'].setValue('');
    this.showError = false;
    this.showClearBtn = false;
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  showDetails(promo, event?) {
    this.modal.open(PromoDetailsComponent, { centered: true });
    this.promoSvc.setAppliedPromo(promo);
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }



  navigateToWrapFees(event) {
    this.modal.dismissAll();
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.FEES]);
    event.stopPropagation();
    event.preventDefault();
  }

  checkError() {
    const formError = this.formGrp.controls['promoCode']['errors'];
    if (formError && (formError['invalidPromoCode'] || formError['promoCodeAlreadyApplied'] ||
      formError['existingPromoCode'] || formError['noExistingPortfolio'])) {
      return true;
    } else {
      return false;
    }
  }

}
