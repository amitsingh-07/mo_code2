import { PromoCodeModalComponent } from './../promo-code-modal/promo-code-modal.component';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PromoCodeService } from './../promo-code.service';
import { PromoCodeListComponent } from './../promo-code-list/promo-code-list.component';
import { PromoDetailsComponent } from './../promo-details/promo-details.component';

@Component({
  selector: 'app-promo-code-select',
  templateUrl: './promo-code-select.component.html',
  styleUrls: ['./promo-code-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PromoCodeSelectComponent implements OnInit {

  details: any;
  showPromoCode: boolean = true;
  showError: boolean = false;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService,
    private promoSvc: PromoCodeService, private modal: NgbModal) {
        this.translate.use('en');
        }

  ngOnInit() {
    this.details = {
      "promoDesc": [{header: "Promotion", content: "Get 20% off Advisory Fee (usual 0.60%) when you top up $10,000 to any SRS portfolio."},
      {header: "How to redeem", content: "- Top up a minimum amount of $10,000<br>- Only applicable to Cash and SRS funded portfolios<br>- Not applicable to WiseSaver portfolio<br>- Applying on an existing promo will overwrite fees and changes are non-reversible."},
      {header: "How to receive", content: "Promotion fees will be reflected in your fees once the processing has been completed."}]
    };
  }

  close() {
    this.activeModal.dismiss();
  }

  openPromoList(e) {
    // Open promo list
    e.preventDefault();
    e.stopPropagation();
    console.log('OPEN PROMO LIST')
    this.modal.open(PromoCodeModalComponent, { centered: true });
  }

  openPromoDetails(e) {
    // Open promo list
    e.preventDefault();
    e.stopPropagation();
    console.log('OPEN PROMO DETAILS')
    this.modal.open(PromoDetailsComponent, { centered: true });
  }

  removePromoCode(e) {
    // Remove applied promo code
    e.preventDefault();
    e.stopPropagation();
    console.log('REMOVE APPLIED PROMO CODE')
    this.showPromoCode = false;
    this.promoSvc.removeAppliedPromo(e);
   }
}
