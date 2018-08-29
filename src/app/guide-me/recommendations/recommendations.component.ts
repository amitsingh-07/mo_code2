import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeCalculateService } from '../guide-me-calculate.service';
import { GuideMeService } from '../guide-me.service';
import { CriticalIllnessData } from './../ci-assessment/ci-assessment';
import { GuideMeApiService } from './../guide-me.api.service';
import { CreateAccountModelComponent } from './create-account-model/create-account-model.component';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbCarouselConfig]
})
export class RecommendationsComponent implements IPageComponent, OnInit {
  pageTitle: string;
  subTitle: string;

  recommendationPlans;
  selectedPlans: any[] = [];
  coverageAmount = '';
  premiumFrom = '';

  activeRecommendationType;
  activeRecommendationList;

  prevActiveSlide;
  nextActiveSlide;

  public innerWidth: any;
  @ViewChild('recommendationCarousel') recommendationCarousel: NgbCarousel;
  @ViewChild('mobileHeaderMenu', { read: ElementRef }) public mobileHeaderMenu: ElementRef<any>;

  constructor(
    private carouselConfig: NgbCarouselConfig, private elRef: ElementRef,
    private translate: TranslateService, public headerService: HeaderService,
    private guideMeApiService: GuideMeApiService, private guideMeCalculateService: GuideMeCalculateService,
    private currency: CurrencyPipe, private guideMeService: GuideMeService, public modal: NgbModal) {
    this.carouselConfig.wrap = false;
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RECOMMENDATIONS.TITLE');
      this.subTitle = this.translate.instant('RECOMMENDATIONS.DESCRIPTION');
      this.setPageTitle(this.pageTitle, this.subTitle);
    });
  }

  ngOnInit() {
    this.recommendationPlans = this.getRecommendations().objectList[0].productProtectionTypeList;
    this.activeRecommendationType = this.recommendationPlans[0].protectionType;
    this.activeRecommendationList = this.recommendationPlans[0];
    this.updateCoverageDetails();

    this.getRecommendationsFromServer();
  }

  getRecommendationsFromServer() {
    this.guideMeApiService.getRecommendations().subscribe(
      (data) => {
        console.log(data);
        this.recommendationPlans = data.objectList[0].productProtectionTypeList;
        this.activeRecommendationType = this.recommendationPlans[0].protectionType;
        this.activeRecommendationList = this.recommendationPlans[0];
        this.updateCoverageDetails();
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  setPageTitle(title: string, subTitle: string) {
    this.headerService.setPageTitle(title, subTitle);
  }

  moveCarouselNext() {
    this.recommendationCarousel.next();
    const container = this.elRef.nativeElement.querySelector('#mobileHeaderMenu');
    const containerBound = container.getBoundingClientRect();
    const bound = container.querySelector('[data-type=\'' + this.activeRecommendationType + '\'').getBoundingClientRect();
    if (bound.right > containerBound.right) {
      this.mobileHeaderMenu.nativeElement.scrollTo(
        {
          left: (this.mobileHeaderMenu.nativeElement.scrollLeft + bound.width),
          behavior: 'smooth'
        });
    }
  }

  moveCarouselPrev() {
    this.recommendationCarousel.prev();
    const container = this.elRef.nativeElement.querySelector('#mobileHeaderMenu');
    const containerBound = container.getBoundingClientRect();
    const bound = container.querySelector('[data-type=\'' + this.activeRecommendationType + '\'').getBoundingClientRect();
    if (bound.left < containerBound.left) {
      this.mobileHeaderMenu.nativeElement.scrollTo(
        {
          left: (this.mobileHeaderMenu.nativeElement.scrollLeft - bound.width),
          behavior: 'smooth'
        });
    }
  }

  slideCarousel(event) {
    if (event.direction === 'left') {
      this.prevActiveSlide = event.prev;
    } else {
      this.nextActiveSlide = event.prev;
    }
    this.activeRecommendationType = event.current;
    this.activeRecommendationList = this.getCurrentRecommendationList();
    this.updateCoverageDetails();
  }

  jumpToSlide(recommendation) {
    this.recommendationCarousel.activeId = recommendation.protectionType;
    this.activeRecommendationType = recommendation.protectionType;
    this.activeRecommendationList = recommendation;
    this.updateCoverageDetails();
  }

  getCurrentRecommendationList() {
    for (const recommendation of this.recommendationPlans) {
      if (this.activeRecommendationType === recommendation.protectionType) {
        return recommendation;
      }
    }
  }

  updateCoverageDetails() {
    this.premiumFrom = this.activeRecommendationList.productList[0].premium.premiumAmount;
    switch (this.activeRecommendationType) {
      case 'Life Protection':
        this.coverageAmount = this.guideMeCalculateService.getLifeProtectionSummary() + '';
        break;
      case 'Critical Illness':
        const criticalIllnessValues: CriticalIllnessData = this.guideMeService.getCiAssessment();
        this.coverageAmount = criticalIllnessValues.annualSalary * criticalIllnessValues.ciMultiplier + '';
        break;
      case 'Occupational Disability':
        this.coverageAmount = this.guideMeService.getMyOcpDisability().coverageAmount + '';
        break;
      case 'Long Term Care':
        this.coverageAmount = '';
        break;
      case 'Hospital Plan':
        this.coverageAmount = '';
        break;
    }
  }

  viewDetails(plan) {
    console.log('viewing plan :' + plan);
  }

  selectPlan(data) {
    if (data.isSelected) {
      console.log('selected plan');
      console.log(data.plan);
      this.selectedPlans.push(data.plan);
    } else {
      console.log('de-selected plan');
      console.log(data.plan);
      const index: number = this.selectedPlans.indexOf(data.plan);
      if (index !== -1) {
        this.selectedPlans.splice(index, 1);
      }
    }
  }

  proceed() {
    const ref = this.modal.open(CreateAccountModelComponent, {
      centered: true
    });
    ref.componentInstance.data = this.selectedPlans.length;
  }
  getRecommendations() {
    return {
      "responseMessage": {
        "responseCode": 6000,
        "responseDescription": "Successful response"
      },
      "objectList": [{
        "enquiryId": 87,
        "productProtectionTypeList": [{
          "typeId": 1,
          "purposeId": 1,
          "objectiveId": 2,
          "protectionType": "Life Protection",
          "protectionTypeDescription": "Life Protection",
          "productList": [{
            "id": "0",
            "riderId": 0,
            "productName": "TM Term Assure",
            "purposeId": 1,
            "objectiveId": 2,
            "typeId": 1,
            "searchCount": 0,
            "whyBuy": "I am concerned my family cannot cope financially with the loss of income upon my demise.",
            "payOut": "A lump sum benefit upon death, terminal illness or total and permanent disability (TPD).",
            "underWritting": "Yes",
            "rebate": "Eligible",
            "cashValue": "No",
            "cashPayoutFrequency": "",
            "coverageDuration": "5, 10 years, 11 - 44 years, up to age 85",
            "premiumDuration": "Throughout policy duration",
            "features": "Policy can be renewed.~Option to convert plan into regular premium Whole Life or endowment plan.",
            "productDescription": "This Term policy provides high protection at low cost with death and TI benefits. This policy has the option to convert into a Whole Life or Endowment policy without underwriting. You can also attach optional riders like Critical Illness (CI) to enhance its benefits. You have the you have the flexibility to convert your term plan into either a regular premium whole life or an endowment plan up to the coverage amount of your policy.",
            "status": "Active",
            "brochureLink": "0",
            "isAuthorised": true,
            "lastUpdated": "2018-08-28T08:51:17.000+0000",
            "lastUpdatedBy": "0",
            "insurer": {
              "id": "TKM",
              "insurerName": "Tokio Marine",
              "logoName": "logo-tokiomarine.png",
              "url": "https://www.tokiomarine.com",
              "lastUpdatedTime": "2017-05-03T07:27:06.000+0000",
              "rating": "",
              "lastUpdatedBy": "0"
            },
            "premium": {
              "id": "P113",
              "gender": "Male",
              "minimumAge": 21,
              "coverageName": "$500,000",
              "durationName": "till age 65",
              "premiumTerm": "",
              "savingsDuration": "",
              "retirementPayourAmount": "",
              "retirementPayourDuration": "",
              "premiumAmount": "435",
              "premiumFrequency": "per year",
              "intrestRateOfReturn": "0.00",
              "ranking": 1,
              "lastUpdatedDate": "2017-03-26T18:30:00.000+0000",
              "lastUpdatedBy": "0"
            },
            "promotion": {
              "insurerId": "TKM",
              "thumbnail": "tkm_term_protection.jpg",
              "promoDiscount": "*28% OFF",
              "promoTitle": "28% First Year Annual Premium Discount for TM Term Assure (Extended)",
              "description": "To qualify for the premium discount, you have to sign up for the product during the promotion period and issued by the deadline.",
              "link": "50.jsp",
              "expired": "FALSE",
              "expiredDate": "2018-06-29T15:59:59.000+0000",
              "lastUpdatedTime": "2018-05-25T04:33:28.000+0000",
              "lastUpdatedBy": "0"
            },
            "authorised": true
          }, {
            "id": "0",
            "riderId": 0,
            "productName": "TM Term Assure",
            "purposeId": 1,
            "objectiveId": 2,
            "typeId": 1,
            "searchCount": 0,
            "whyBuy": "I am concerned my family cannot cope financially with the loss of income upon my demise.",
            "payOut": "A lump sum benefit upon death, terminal illness or total and permanent disability (TPD).",
            "underWritting": "Yes",
            "rebate": "Eligible",
            "cashValue": "No",
            "cashPayoutFrequency": "",
            "coverageDuration": "5, 10 years, 11 - 44 years, up to age 85",
            "premiumDuration": "Throughout policy duration",
            "features": "Policy can be renewed.~Option to convert plan into regular premium Whole Life or endowment plan.",
            "productDescription": "This Term policy provides high protection at low cost with death and TI benefits. This policy has the option to convert into a Whole Life or Endowment policy without underwriting. You can also attach optional riders like Critical Illness (CI) to enhance its benefits. You have the you have the flexibility to convert your term plan into either a regular premium whole life or an endowment plan up to the coverage amount of your policy.",
            "status": "Active",
            "brochureLink": "0",
            "isAuthorised": true,
            "lastUpdated": "2018-08-28T08:51:17.000+0000",
            "lastUpdatedBy": "0",
            "insurer": {
              "id": "TKM",
              "insurerName": "Tokio Marine",
              "logoName": "logo-tokiomarine.png",
              "url": "https://www.tokiomarine.com",
              "lastUpdatedTime": "2017-05-03T07:27:06.000+0000",
              "rating": "",
              "lastUpdatedBy": "0"
            },
            "premium": {
              "id": "P113",
              "gender": "Male",
              "minimumAge": 21,
              "coverageName": "$500,000",
              "durationName": "till age 65",
              "premiumTerm": "",
              "savingsDuration": "",
              "retirementPayourAmount": "",
              "retirementPayourDuration": "",
              "premiumAmount": "435",
              "premiumFrequency": "per year",
              "intrestRateOfReturn": "0.00",
              "ranking": 1,
              "lastUpdatedDate": "2017-03-26T18:30:00.000+0000",
              "lastUpdatedBy": "0"
            },
            "promotion": {
              "insurerId": "TKM",
              "thumbnail": "tkm_term_protection.jpg",
              "promoDiscount": "*28% OFF",
              "promoTitle": "28% First Year Annual Premium Discount for TM Term Assure (Extended)",
              "description": "To qualify for the premium discount, you have to sign up for the product during the promotion period and issued by the deadline.",
              "link": "50.jsp",
              "expired": "FALSE",
              "expiredDate": "2018-06-29T15:59:59.000+0000",
              "lastUpdatedTime": "2018-05-25T04:33:28.000+0000",
              "lastUpdatedBy": "0"
            },
            "authorised": true
          }
          ]
        }, {
          "typeId": 1,
          "purposeId": 1,
          "objectiveId": 2,
          "protectionType": "Critical Illness",
          "protectionTypeDescription": "Critical Illness",
          "productList": [{
            "id": "0",
            "riderId": 0,
            "productName": "TM Term Assure",
            "purposeId": 1,
            "objectiveId": 2,
            "typeId": 1,
            "searchCount": 0,
            "whyBuy": "I am concerned my family cannot cope financially with the loss of income upon my demise.",
            "payOut": "A lump sum benefit upon death, terminal illness or total and permanent disability (TPD).",
            "underWritting": "Yes",
            "rebate": "Eligible",
            "cashValue": "No",
            "cashPayoutFrequency": "",
            "coverageDuration": "5, 10 years, 11 - 44 years, up to age 85",
            "premiumDuration": "Throughout policy duration",
            "features": "Policy can be renewed.~Option to convert plan into regular premium Whole Life or endowment plan.",
            "productDescription": "This Term policy provides high protection at low cost with death and TI benefits. This policy has the option to convert into a Whole Life or Endowment policy without underwriting. You can also attach optional riders like Critical Illness (CI) to enhance its benefits. You have the you have the flexibility to convert your term plan into either a regular premium whole life or an endowment plan up to the coverage amount of your policy.",
            "status": "Active",
            "brochureLink": "0",
            "isAuthorised": true,
            "lastUpdated": "2018-08-28T08:51:17.000+0000",
            "lastUpdatedBy": "0",
            "insurer": {
              "id": "TKM",
              "insurerName": "Tokio Marine",
              "logoName": "logo-tokiomarine.png",
              "url": "https://www.tokiomarine.com",
              "lastUpdatedTime": "2017-05-03T07:27:06.000+0000",
              "rating": "",
              "lastUpdatedBy": "0"
            },
            "premium": {
              "id": "P113",
              "gender": "Male",
              "minimumAge": 21,
              "coverageName": "$500,000",
              "durationName": "till age 65",
              "premiumTerm": "",
              "savingsDuration": "",
              "retirementPayourAmount": "",
              "retirementPayourDuration": "",
              "premiumAmount": "435",
              "premiumFrequency": "per year",
              "intrestRateOfReturn": "0.00",
              "ranking": 1,
              "lastUpdatedDate": "2017-03-26T18:30:00.000+0000",
              "lastUpdatedBy": "0"
            },
            "promotion": {
              "insurerId": "TKM",
              "thumbnail": "tkm_term_protection.jpg",
              "promoDiscount": "*28% OFF",
              "promoTitle": "28% First Year Annual Premium Discount for TM Term Assure (Extended)",
              "description": "To qualify for the premium discount, you have to sign up for the product during the promotion period and issued by the deadline.",
              "link": "50.jsp",
              "expired": "FALSE",
              "expiredDate": "2018-06-29T15:59:59.000+0000",
              "lastUpdatedTime": "2018-05-25T04:33:28.000+0000",
              "lastUpdatedBy": "0"
            },
            "authorised": true
          }, {
            "id": "0",
            "riderId": 0,
            "productName": "TM Term Assure",
            "purposeId": 1,
            "objectiveId": 2,
            "typeId": 1,
            "searchCount": 0,
            "whyBuy": "I am concerned my family cannot cope financially with the loss of income upon my demise.",
            "payOut": "A lump sum benefit upon death, terminal illness or total and permanent disability (TPD).",
            "underWritting": "Yes",
            "rebate": "Eligible",
            "cashValue": "No",
            "cashPayoutFrequency": "",
            "coverageDuration": "5, 10 years, 11 - 44 years, up to age 85",
            "premiumDuration": "Throughout policy duration",
            "features": "Policy can be renewed.~Option to convert plan into regular premium Whole Life or endowment plan.",
            "productDescription": "This Term policy provides high protection at low cost with death and TI benefits. This policy has the option to convert into a Whole Life or Endowment policy without underwriting. You can also attach optional riders like Critical Illness (CI) to enhance its benefits. You have the you have the flexibility to convert your term plan into either a regular premium whole life or an endowment plan up to the coverage amount of your policy.",
            "status": "Active",
            "brochureLink": "0",
            "isAuthorised": true,
            "lastUpdated": "2018-08-28T08:51:17.000+0000",
            "lastUpdatedBy": "0",
            "insurer": {
              "id": "TKM",
              "insurerName": "Tokio Marine",
              "logoName": "logo-tokiomarine.png",
              "url": "https://www.tokiomarine.com",
              "lastUpdatedTime": "2017-05-03T07:27:06.000+0000",
              "rating": "",
              "lastUpdatedBy": "0"
            },
            "premium": {
              "id": "P113",
              "gender": "Male",
              "minimumAge": 21,
              "coverageName": "$500,000",
              "durationName": "till age 65",
              "premiumTerm": "",
              "savingsDuration": "",
              "retirementPayourAmount": "",
              "retirementPayourDuration": "",
              "premiumAmount": "435",
              "premiumFrequency": "per year",
              "intrestRateOfReturn": "0.00",
              "ranking": 1,
              "lastUpdatedDate": "2017-03-26T18:30:00.000+0000",
              "lastUpdatedBy": "0"
            },
            "promotion": {
              "insurerId": "TKM",
              "thumbnail": "tkm_term_protection.jpg",
              "promoDiscount": "*28% OFF",
              "promoTitle": "28% First Year Annual Premium Discount for TM Term Assure (Extended)",
              "description": "To qualify for the premium discount, you have to sign up for the product during the promotion period and issued by the deadline.",
              "link": "50.jsp",
              "expired": "FALSE",
              "expiredDate": "2018-06-29T15:59:59.000+0000",
              "lastUpdatedTime": "2018-05-25T04:33:28.000+0000",
              "lastUpdatedBy": "0"
            },
            "authorised": true
          }
          ]
        }, {
          "typeId": 1,
          "purposeId": 1,
          "objectiveId": 3,
          "protectionType": "Occupational Disability",
          "protectionTypeDescription": "Occupational Disability",
          "productList": [{
            "id": "0",
            "riderId": 0,
            "productName": "IdealIncome",
            "purposeId": 1,
            "objectiveId": 3,
            "typeId": 1,
            "searchCount": 0,
            "whyBuy": "I am concerned with a loss of income if I lose my ability to work in my own occupation or similar occupation as a result of illness or sickness.",
            "payOut": "A monthly income benefit if unable to work in my own or suitable occupation",
            "underWritting": "Yes",
            "rebate": "Eligible",
            "cashValue": "No",
            "cashPayoutFrequency": "",
            "coverageDuration": "till age 55/60/65",
            "premiumDuration": "Throughout policy duration",
            "features": "Partial Disability Income Benefit.~Rehabilitation Benefit.~Optional Escalation Benefit.",
            "productDescription": "This is a unique Disability Income Insurance that pays an monthly income benefit should you be unable to work in your own occupation or any occupation suited by virtue of training, education or experience as a result of sickness or disability. Unlike other disability benefit, this policy insure your income earning ability. A Partial Disability income benefit will be payable if you are able to return to work at a lower capacity after such disability. There is reimbursement of up to 3 times the monthly total or partial disability benefit for rehabilitation purpose. You can choose optional benefit to escalate the monthly income payout by 3% pa, to keep up with inflation. Policy premium is dependent on your type of occupation; more specialised or riskier occupation would require a higher premium. ",
            "status": "Active",
            "brochureLink": "0",
            "isAuthorised": true,
            "lastUpdated": "2018-08-28T08:51:17.000+0000",
            "lastUpdatedBy": "0",
            "insurer": {
              "id": "AVV",
              "insurerName": "Aviva",
              "logoName": "logo-aviva.png",
              "url": "https://www.aviva.com.sg",
              "lastUpdatedTime": "2017-05-03T07:24:46.000+0000",
              "rating": "",
              "lastUpdatedBy": "0"
            },
            "premium": {
              "id": "P045",
              "gender": "Male",
              "minimumAge": 21,
              "coverageName": "$2,000 monthly",
              "durationName": "till age 65",
              "premiumTerm": "",
              "savingsDuration": "",
              "retirementPayourAmount": "",
              "retirementPayourDuration": "",
              "premiumAmount": "303",
              "premiumFrequency": "per year",
              "intrestRateOfReturn": "0.00",
              "ranking": 1,
              "lastUpdatedDate": "2017-02-20T18:30:00.000+0000",
              "lastUpdatedBy": "0"
            },
            "promotion": {
              "insurerId": "AVV",
              "thumbnail": "aviva_giftbox.jpg",
              "promoDiscount": "*VOUCHERS & TREATS",
              "promoTitle": "Receive shopping vouchers, e-vouchers, dining treats or hotel stays",
              "description": "Receive shopping vouchers, e-vouchers, dining treats or hotel stays with purchase of these Aviva plans!",
              "link": "29.jsp",
              "expired": "TRUE",
              "expiredDate": "2017-09-30T15:59:59.000+0000",
              "lastUpdatedTime": "2017-10-16T07:35:44.000+0000",
              "lastUpdatedBy": "0"
            },
            "authorised": true
          }, {
            "id": "0",
            "riderId": 0,
            "productName": "IdealIncome",
            "purposeId": 1,
            "objectiveId": 3,
            "typeId": 1,
            "searchCount": 0,
            "whyBuy": "I am concerned with a loss of income if I lose my ability to work in my own occupation or similar occupation as a result of illness or sickness.",
            "payOut": "A monthly income benefit if unable to work in my own or suitable occupation",
            "underWritting": "Yes",
            "rebate": "Eligible",
            "cashValue": "No",
            "cashPayoutFrequency": "",
            "coverageDuration": "till age 55/60/65",
            "premiumDuration": "Throughout policy duration",
            "features": "Partial Disability Income Benefit.~Rehabilitation Benefit.~Optional Escalation Benefit.",
            "productDescription": "This is a unique Disability Income Insurance that pays an monthly income benefit should you be unable to work in your own occupation or any occupation suited by virtue of training, education or experience as a result of sickness or disability. Unlike other disability benefit, this policy insure your income earning ability. A Partial Disability income benefit will be payable if you are able to return to work at a lower capacity after such disability. There is reimbursement of up to 3 times the monthly total or partial disability benefit for rehabilitation purpose. You can choose optional benefit to escalate the monthly income payout by 3% pa, to keep up with inflation. Policy premium is dependent on your type of occupation; more specialised or riskier occupation would require a higher premium. ",
            "status": "Active",
            "brochureLink": "0",
            "isAuthorised": true,
            "lastUpdated": "2018-08-28T08:51:17.000+0000",
            "lastUpdatedBy": "0",
            "insurer": {
              "id": "AVV",
              "insurerName": "Aviva",
              "logoName": "logo-aviva.png",
              "url": "https://www.aviva.com.sg",
              "lastUpdatedTime": "2017-05-03T07:24:46.000+0000",
              "rating": "",
              "lastUpdatedBy": "0"
            },
            "premium": {
              "id": "P045",
              "gender": "Male",
              "minimumAge": 21,
              "coverageName": "$2,000 monthly",
              "durationName": "till age 65",
              "premiumTerm": "",
              "savingsDuration": "",
              "retirementPayourAmount": "",
              "retirementPayourDuration": "",
              "premiumAmount": "303",
              "premiumFrequency": "per year",
              "intrestRateOfReturn": "0.00",
              "ranking": 1,
              "lastUpdatedDate": "2017-02-20T18:30:00.000+0000",
              "lastUpdatedBy": "0"
            },
            "promotion": {
              "insurerId": "AVV",
              "thumbnail": "aviva_giftbox.jpg",
              "promoDiscount": "*VOUCHERS & TREATS",
              "promoTitle": "Receive shopping vouchers, e-vouchers, dining treats or hotel stays",
              "description": "Receive shopping vouchers, e-vouchers, dining treats or hotel stays with purchase of these Aviva plans!",
              "link": "29.jsp",
              "expired": "TRUE",
              "expiredDate": "2017-09-30T15:59:59.000+0000",
              "lastUpdatedTime": "2017-10-16T07:35:44.000+0000",
              "lastUpdatedBy": "0"
            },
            "authorised": true
          }
          ]
        }
        ]
      }
      ]
    };
  }
}
