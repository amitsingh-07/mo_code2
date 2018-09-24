import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recommendations-modal',
  templateUrl: './recommendations-modal.component.html',
  styleUrls: ['./recommendations-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecommendationsModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }
  @Input() title: any;
  @Input() message: any;

  ngOnInit() {
  }

}
