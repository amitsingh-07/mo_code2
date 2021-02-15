import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-promo-code-modal',
  templateUrl: './promo-code-modal.component.html',
  styleUrls: ['./promo-code-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PromoCodeModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal, 
    private translate: TranslateService) {
    this.translate.use('en');
  }

  ngOnInit() { }

  close() {
    this.activeModal.dismiss();
  }

}
