import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PromoCodeService } from './../promo-code.service';
import { PromoCodeModalComponent } from './../promo-code-modal/promo-code-modal.component';
import { PromoDetailsComponent } from './../promo-details/promo-details.component';

@Component({
  selector: 'app-promo-code-select',
  templateUrl: './promo-code-select.component.html',
  styleUrls: ['./promo-code-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PromoCodeSelectComponent implements OnInit {

  usedPromo: any;
  showError: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService,
    private promoSvc: PromoCodeService,
    private modal: NgbModal) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.promoSvc.usedPromo.subscribe((data) => {
      this.usedPromo = data;
    });
  }

  close() {
    this.activeModal.dismiss();
  }

  // Open promo list or promo details
  openPromoListOrDetails(e) {
    if (this.usedPromo && this.usedPromo?.shortDescription) {
      this.modal.open(PromoDetailsComponent, { centered: true });
    } else {
      this.modal.open(PromoCodeModalComponent, { centered: true });
    }
    e.preventDefault();
    e.stopPropagation();
  }

  // On remove btn press remove applied promo code
  removePromoCode(e) {
    this.promoSvc.removeAppliedPromo();
    e.preventDefault();
    e.stopPropagation();
  }
}
