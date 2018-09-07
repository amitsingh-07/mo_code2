import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HelpModalComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() img: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
