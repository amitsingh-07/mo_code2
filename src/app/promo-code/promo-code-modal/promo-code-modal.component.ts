import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PromoCodeService } from './../promo-code.service';

@Component({
  selector: 'app-promo-code-modal',
  templateUrl: './promo-code-modal.component.html',
  styleUrls: ['./promo-code-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PromoCodeModalComponent implements OnInit {

  details: any;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService,
    private promoSvc: PromoCodeService) {
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

  usePromo() {
    //Call promo-code.service and set the promo as used
    this.promoSvc.useSelectedPromo(this.details);
    this.activeModal.dismiss();
  }
}
