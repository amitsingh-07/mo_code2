import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-life-protection-modal',
  templateUrl: './life-protection-modal.component.html',
  styleUrls: ['./life-protection-modal.component.scss']
})
export class LifeProtectionModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
