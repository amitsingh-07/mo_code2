import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SuccessIcons } from './successIcon';

@Component({
  selector: 'app-add-portfolio-status',
  templateUrl: './add-portfolio-status.component.html',
  styleUrls: ['./add-portfolio-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPortfolioStatusComponent implements OnInit {
  iconImage;
  @Input() riskProfileId;
  @Input() portfolioName;
  @Output() createdNameSuccessfully = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal,
              private router: Router, ) { }

  ngOnInit() {
    this.iconImage = SuccessIcons[this.riskProfileId - 1]['icon'];

  }
  portfolioNameSuccessfully(value) {
    this.createdNameSuccessfully.emit(value);
    this.activeModal.close();
  }
}