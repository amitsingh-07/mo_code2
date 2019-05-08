import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forward-pricing-modal',
  templateUrl: './forward-pricing-modal.component.html',
  styleUrls: ['./forward-pricing-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForwardPricingModalComponent implements OnInit {
  @Output() showLearnMore: EventEmitter<any> = new EventEmitter();
  WITHDRAW_CONSTANTS;

  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService) { }

  ngOnInit() {
  }

}
