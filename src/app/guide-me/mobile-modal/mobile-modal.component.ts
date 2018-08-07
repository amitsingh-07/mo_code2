import { Component, Input, OnInit, ViewEncapsulation  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mobile-modal',
  templateUrl: './mobile-modal.component.html',
  styleUrls: ['./mobile-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MobileModalComponent implements OnInit {
  @Input() mobileTitle: string;
  @Input() description: string;
  @Input() icon_description: string;
  @Input() img: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
