import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from  './../../../investment/investment-engagement-journey/investment-engagement-journey.constants';
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
  investmentEnabled: boolean;
  wiseSaverEnabled : boolean;
  wiseIncomeEnabled: boolean;
  
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
    if((this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVESTMENT.toLowerCase() || this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO.toLowerCase() )){
      this.investmentEnabled = true;
      this.wiseSaverEnabled = false;
      this.wiseIncomeEnabled = false;
    }
    if( (this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME.toLowerCase() || this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO.toLowerCase() )){
      this.investmentEnabled = false;
      this.wiseSaverEnabled = false;
      this.wiseIncomeEnabled = true;
    }
    if((this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER.toLowerCase() || this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO.toLowerCase() )){
      this.investmentEnabled = false;
      this.wiseSaverEnabled = true;
      this.wiseIncomeEnabled = false;
    }
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
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    let newWindow;
    if (iOS) {
      newWindow = window.open();
    }
    if (fund.factSheetLink) {
      highlightSheetFileName = fund.factSheetLink.split('|')[1];
    }
    const pdfUrl = document.getElementsByTagName('base')[0].href + 'assets/docs/portfolio/fund/' + highlightSheetFileName;
    if (iOS) {
      if (newWindow.document.readyState === 'complete') {
        newWindow.location.assign(pdfUrl);
      } else {
        newWindow.onload = () => {
          newWindow.location.assign(pdfUrl);
        };
      }
    } else {        
      this.downloadFile(highlightSheetFileName);
    }
    
  }
  getProspectusLink() {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    let newWindow;
    if (iOS) {
      newWindow = window.open();
    }
    let prospectusFileName;
    if(this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVESTMENT.toLowerCase() || this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO.toLowerCase()){
      prospectusFileName = 'prospectus_investment.pdf';
    } else if(this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER.toLowerCase() || this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO.toLowerCase()){
      prospectusFileName = 'prospectus_wise_saver.pdf';
    } else if(this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME.toLowerCase() || this.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO.toLowerCase()){
      prospectusFileName = 'prospectus_wise_income.pdf';
    }
    const pdfUrl = document.getElementsByTagName('base')[0].href + 'assets/docs/portfolio/fund/' + prospectusFileName;
    if (iOS) {
      if (newWindow.document.readyState === 'complete') {
        newWindow.location.assign(pdfUrl);
      } else {
        newWindow.onload = () => {
          newWindow.location.assign(pdfUrl);
        };
      }
    } else {        
      this.downloadFile(prospectusFileName);
    }
  }
  
  downloadFile(fileName) {
    const url = document.getElementsByTagName('base')[0].href + 'assets/docs/portfolio/fund/' + fileName;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);

  }
}
