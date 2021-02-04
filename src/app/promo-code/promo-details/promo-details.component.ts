import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService, private router: Router,
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
      this.details = data.promoList.find(element => element['promoCode'] === this.selectedPromo['promoCode']);
    } );
    // let promoJSON = {
    //   "promoList": [{
    //       "promoCode": "MOSAF20",
    //       "header": "Safra Member 20% Off",
    //       "validity": "Valid until DD MTH YYYY",
    //       "promoDesc": [{
    //           "title": "Promotion",
    //           "content": "Get 20% off Advisory Fee (usual 0.60%) when you top up $10,000 to any SRS portfolio."
    //         },
    //         {
    //           "title": "How to redeem",
    //           "content": "- Top up a minimum amount of $10,000<br>- Only applicable to Cash and SRS funded portfolios<br>- Not applicable to WiseSaver portfolio<br>- Applying on an existing promo will overwrite fees and changes are non-reversible."
    //         },
    //         {
    //           "title": "How to receive",
    //           "content": "Promotion fees will be reflected in your fees once the processing has been completed."
    //         }
    //       ]
    //     },
    //     {
    //       "promoCode": "MOFP5V",
    //       "header": "FairPrice Special 5% Off",
    //       "validity": "Valid until DD MTH YYYY",
    //       "promoDesc": [{
    //           "title": "Promotion",
    //           "content": "Get 20% off Advisory Fee (usual 0.60%) when you top up $10,000 to any SRS portfolio."
    //         },
    //         {
    //           "title": "How to redeem",
    //           "content": "- Top up a minimum amount of $10,000<br>- Only applicable to Cash and SRS funded portfolios<br>- Not applicable to WiseSaver portfolio<br>- Applying on an existing promo will overwrite fees and changes are non-reversible."
    //         },
    //         {
    //           "title": "How to receive",
    //           "content": "Promotion fees will be reflected in your fees once the processing has been completed."
    //         }
    //       ]
    //     },
    //     {
    //       "promoCode": "MOINC20",
    //       "header": "NTUC Income 20% Off",
    //       "validity": "Valid until DD MTH YYYY",
    //       "promoDesc": [{
    //           "title": "Promotion",
    //           "content": "Get 20% off Advisory Fee (usual 0.60%) when you top up $10,000 to any SRS portfolio."
    //         },
    //         {
    //           "title": "How to redeem",
    //           "content": "- Top up a minimum amount of $10,000<br>- Only applicable to Cash and SRS funded portfolios<br>- Not applicable to WiseSaver portfolio<br>- Applying on an existing promo will overwrite fees and changes are non-reversible."
    //         },
    //         {
    //           "title": "How to receive",
    //           "content": "Promotion fees will be reflected in your fees once the processing has been completed."
    //         }
    //       ]
    //     }
    //   ]
    // };
    // this.details = promoJSON.promoList.find(element => element.promoCode === this.selectedPromo.code);
  }

  close() {
    this.activeModal.dismiss();
  }

  usePromo(e) {
    //Call promo-code.service and set the promo as used
    this.promoSvc.useSelectedPromo(this.selectedPromo, this.router.url);
    console.log('USING PROMO, ', this.selectedPromo)
    console.log('USING PROMO, ', this.router.url)
    this.activeModal.dismiss();
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
