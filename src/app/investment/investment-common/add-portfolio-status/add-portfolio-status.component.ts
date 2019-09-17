import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';


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
              public investmentAccountService: InvestmentAccountService) { }

  ngOnInit() {
   // this.iconImage = SuccessIcons[this.riskProfileId - 1]['icon'];
    this.investmentAccountService.restrictBackNavigation();
  }

  portfolioNameSuccess() {
    this.createdNameSuccessfully.emit(this.portfolioName);
    this.activeModal.close();
  }
}
