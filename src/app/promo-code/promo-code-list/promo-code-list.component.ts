import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavbarService } from './../../shared/navbar/navbar.service';
import { PromoDetailsComponent } from './../promo-details/promo-details.component';
import { PromoCodeService } from './../promo-code.service';
import { PROMO_CODE_STATUS } from './../promo-code.constants';

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
    private modal: NgbModal) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.promoCodeStatus = PROMO_CODE_STATUS;
    this.formGrp = this.formBuilder.group({
      promoCode: ['', [Validators.required]]
    });
    this.promoSvc.getPromoWallet().subscribe((response)=> {
      if (response && response['objectList']) {
        this.promoArray = response['objectList'];
        this.promoSvc.promoCodeWalletList.next(response['objectList']);
      } 
      // Error
    });
    // Fetch the promo list json
    this.promoSvc.fetchPromoListJSON();
    // Set the new promo list when any changes to the promo wallet
    this.promoSvc.promoWalletObservable.subscribe((data)=>{
      this.promoArray = data;
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
            } else {
              this.formGrp.controls['promoCode'].setErrors({ invalidPromoCode: true });
            }
          }, 1200);
        }
      });
    }
    event.stopPropagation();
    event.preventDefault();
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

}
