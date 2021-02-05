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
      console.log('data = ', data)
      this.usedPromo = data;
    });
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
    this.promoSvc.removeAppliedPromo();
  }
}
