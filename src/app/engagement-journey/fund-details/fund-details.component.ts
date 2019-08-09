import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { EngagementJourneyService } from '../engagement-journey.service';

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

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private modal: NgbModal,
    public activeModal: NgbActiveModal,
    private _location: Location,
    public engagementJourneyService: EngagementJourneyService
  ) {
    this.translate.use('en');
  }
  ngOnInit() {
    this.fundDetails = this.engagementJourneyService.getFundDetails();
  }

  showHide(el) {
    const fundContentEle = el.getElementsByClassName('funding-content')[0];
    if (
      fundContentEle.classList.contains('active') ||
      fundContentEle.classList.contains('first')
    ) {
      fundContentEle.classList.remove('active');
      fundContentEle.classList.remove('first');
      el.getElementsByClassName('fund-heading')[0].classList.remove('active');
    } else {
      fundContentEle.classList.add('active');
      el.getElementsByClassName('fund-heading')[0].classList.add('active');
    }
  }

  getHighlightSheetLink(fund) {
    let highlightSheetFileName;
    if (fund.factSheetLink) {
      highlightSheetFileName = fund.factSheetLink.split('|')[1];
    }
    return window.location.origin + '/assets/docs/portfolio/fund/' + highlightSheetFileName;
  }
  getProspectusLink(fund) {
    //let prospectusFileName = fund.prospectusLink; // TODO: getting null from backend
    let prospectusFileName = 'prospectus.pdf';
    return window.location.origin + '/assets/docs/portfolio/fund/' + prospectusFileName;
  }
}
