import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NavbarService } from './../../shared/navbar/navbar.service';
import { PromoDetailsComponent } from './../promo-details/promo-details.component';
import { PromoCodeService } from './../promo-code.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from './../../investment/manage-investments/manage-investments-routes.constants';
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
    public activeModal: NgbActiveModal, public translate: TranslateService,
    public navbarService: NavbarService, private promoSvc: PromoCodeService, private modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }

  ngOnInit() {
    this.promoCodeStatus = PROMO_CODE_STATUS;
    this.formGrp = this.formBuilder.group({
      promoCode: ['', [Validators.required]]
    });
    this.promoArray = this.promoSvc.getPromoWallet();
    // Fetch the promo list json
    this.promoSvc.fetchPromoListJSON();
  }

  onKeyupEvent(event, key) {
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
    let promo =
    {
      "promoCodeId": 107,
      "appliedDate": "2020-11-30",
      "campaignId": null,
      "campaignStartDate": null,
      "campaignEndDate": null,
      "promoCode": "MOSAF20",
      "category": "INVEST",
      "subCategory": null,
      "shortDescription": "Safra Member (MOSAF20)",
      "description": "NTU Alumni: Additional 5% off public rate advisory fee as compared to public via promo code",
      "promoCodeStatus": "I",
      "promoCodeStartDate": "2020-11-17",
      "promoCodeEndDate": "2020-11-30",
      "profileType": "PUBLIC",
      "isWrapFeeRelated": "Y",
      "wrapFeeDiscount": null,
      "topupReq": "Y",
      "createdTs": "2021-01-24T07:24:40.000+0000",
      "lastUpdatedTs": "2021-01-24T07:24:40.000+0000",
      "customerPromoStatus": "not_in_use"
    };
    if (this.formGrp.controls['promoCode'].value) {
      // Show the spinner
      this.formGrp.controls['promoCode'].setErrors(null);
      this.showClearBtn = false;
      this.showSpinner = true;
      // Success/Failure scenario
      if (this.formGrp.controls['promoCode'].value === 'MOSAF20') {
        this.showSpinner = false;
        this.showClearBtn = true;
        // this.promoCodeValidated = true;
        this.showDetails(promo);
      } else {
        setTimeout(() => {
          this.showSpinner = false;
          this.showClearBtn = true;
          this.showError = true;
          if (this.formGrp.controls['promoCode'].value === '123456') {
            this.formGrp.controls['promoCode'].setErrors({ promoCodeAlreadyApplied: true });
          } else if (this.formGrp.controls['promoCode'].value === '654321') {
            this.formGrp.controls['promoCode'].setErrors({ existingPromoCode: true });
          } else {
            this.formGrp.controls['promoCode'].setErrors({ invalidPromoCode: true });
          }
        }, 1200);
      }
    }
    // this.promoSvc.validatePromoCode(this.formGrp.controls['promoCode'].value).subscribe((response)=>{
    //   // Success
    //   if (response.responseMessage['responseCode'] === 6012) {
    //     setTimeout(() => {
    //       this.showSpinner = false;
    //       this.showClearBtn = true;
    //       this.showDetails(promo);
    //     }, 1200);
    //   } else {
    //     setTimeout(() => {
    //       this.showSpinner = false;
    //       this.showClearBtn = true;
    //       this.showError = true;
    //       // Show different error codes
    //       if (this.formGrp.controls['promoCode'].value === '123456') {
    //         this.formGrp.controls['promoCode'].setErrors({ promoCodeAlreadyApplied: true });
    //       } else if (this.formGrp.controls['promoCode'].value === '654321') {
    //         this.formGrp.controls['promoCode'].setErrors({ existingPromoCode: true });
    //       } else {
    //         this.formGrp.controls['promoCode'].setErrors({ invalidPromoCode: true });
    //       }
    //     }, 1200);
    //   }
    // });
    event.stopPropagation();
    event.preventDefault();
  }

  clearPromoCode(event) {
    this.formGrp.controls['promoCode'].setValue('');
    this.showError = false;
    this.showClearBtn = false;
    event.stopPropagation();
    event.preventDefault();
  }

  showDetails(promo, event?) {
    const modalRef = this.modal.open(PromoDetailsComponent, { centered: true });
    this.promoSvc.setAppliedPromo(promo);
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

}
