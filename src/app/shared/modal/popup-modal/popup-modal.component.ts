import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupModalComponent implements OnInit {
  @Input() popupTitle: any;
  @Input() popupMessage: any;

  constructor() { }

  ngOnInit() {
  }

}
