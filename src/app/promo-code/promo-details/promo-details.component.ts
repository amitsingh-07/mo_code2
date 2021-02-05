import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { PromoCodeService } from './../promo-code.service';
import { PROMO_CODE_STATUS } from './../promo-code.constants';

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
    private promoSvc: PromoCodeService) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.promoCodeStatus = PROMO_CODE_STATUS;
    this.selectedPromo = this.promoSvc.getSelectedPromo();
    this.usedPromo = this.promoSvc.usedPromo;
    console.log('SELECTED =', this.selectedPromo)
    console.log('USED = ', this.usedPromo)

    this.promoSvc.fetchPromoListJSON().then((data) => {
      this.details = data.promoList.find(element => {
        if (this.selectedPromo['promoCode']) {
          console.log('INSIDE IF')
          return element['promoCode'] === this.selectedPromo['promoCode'];
        } else {
          console.log('INSIDE ELSE')
          return element['promoCode'] === this.selectedPromo['code'];
        }
      });
    });
  }

  close() {
    this.activeModal.dismiss();
  }

  usePromo(e) {
    //Call promo-code.service and set the promo as used
    this.promoSvc.useSelectedPromo(this.selectedPromo, this.router.url);
    console.log('USING PROMO, ', this.selectedPromo)
    console.log('USING PROMO, ', this.router.url)
    this.allModal.dismissAll();
    e.preventDefault();
    e.stopPropagation();
  }

  removePromoCode(e) {
    // Remove applied promo code
    console.log('REMOVE APPLIED PROMO CODE')
    this.promoSvc.removeAppliedPromo();
    this.activeModal.dismiss();
    e.preventDefault();
    e.stopPropagation();
  }
}
