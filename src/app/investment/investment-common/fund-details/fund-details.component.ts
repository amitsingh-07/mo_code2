import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundDetailsComponent implements OnInit {
  pageTitle: string;
  financialDetails: FormGroup;
  FinancialFormData;
  formValues;
  fundDetails;
  arrowup = true;
  arrowdown = true;
  selected;
  showArrow = false;
  fund;
  fundDetail: any;
  prospectusFile: any;
  
  @Input('portfolioType') portfolioType;

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private modal: NgbModal,
    public activeModal: NgbActiveModal,
    private _location: Location,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService
  ) {
    this.translate.use('en');
  }
  ngOnInit() {
    this.fundDetails = this.investmentEngagementJourneyService.getFundDetails();
  }

  showHide(el) {
    const fundContentEle = document.getElementsByClassName('funding-content')[el];
    if (
      fundContentEle.classList.contains('active') ||
      fundContentEle.classList.contains('first')
    ) {
      fundContentEle.classList.remove('active');
      fundContentEle.classList.remove('first');
      document.getElementsByClassName('fund-heading')[el].classList.remove('active');
    } else {
      fundContentEle.classList.add('active');
      document.getElementsByClassName('fund-heading')[el].classList.add('active');
    }
  }

  getHighlightSheetLink(fund) {
    let highlightSheetFileName;
    if (fund.factSheetLink) {
      highlightSheetFileName = fund.factSheetLink.split('|')[1];
    }
    return window.location.origin + '/app/assets/docs/portfolio/fund/' + highlightSheetFileName;
  }
  getProspectusLink(fund) {
    //let prospectusFileName = fund.prospectusLink; // TODO: getting null from backend
    let prospectusFileName = (this.portfolioType) ? 'prospectus_investment.pdf' : 'prospectus_wise_saver.pdf';
    return window.location.origin + '/app/assets/docs/portfolio/fund/' + prospectusFileName;
  }
}
