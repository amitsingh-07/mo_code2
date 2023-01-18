import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-will-disclaimer',
  templateUrl: './will-disclaimer.component.html',
  styleUrls: ['./will-disclaimer.component.scss']
})
export class WillDisclaimerComponent {
  @Input() title: string;
  @Input() message: string;
  @Input() agree: string;

  constructor(public activeModal: NgbActiveModal) { }

}
