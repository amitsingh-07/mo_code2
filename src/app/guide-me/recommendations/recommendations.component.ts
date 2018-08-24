import { GuideMeApiService } from './../guide-me.api.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';

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

  activeRecommendationType;

  prevActiveSlide;
  nextActiveSlide;

  public innerWidth: any;
  @ViewChild('recommendationCarousel') recommendationCarousel: NgbCarousel;
  @ViewChild('mobileHeaderMenu', { read: ElementRef }) public mobileHeaderMenu: ElementRef<any>;

  constructor(
    private carouselConfig: NgbCarouselConfig, private elRef: ElementRef,
    private translate: TranslateService, public headerService: HeaderService,
    private guideMeApiService: GuideMeApiService) {
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
    this.getRecommendationsFromServer();
  }

  getRecommendationsFromServer() {
    this.guideMeApiService.getRecommendations().subscribe(
      (data) => {
        console.log(data);
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
  }

  jumpToSlide(type) {
    this.recommendationCarousel.activeId = type;
    this.activeRecommendationType = type;
  }

  viewDetails(plan) {
    console.log('viewing plan :' + plan);
  }

  selectPlan(data) {
    /*
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
    */
  }

  getRecommendations() {
    return {
      "responseCode": 6000,
      "responseMessage": "Successful response",
      "objectList": [{
          "enquiryId": 2,
          "productProtectionTypeList": [{
              "protectionType": "Life Protection",
              "protectionTypeDescription": "Life Protection",
              "productList": [{
                  "id": null,
                  "riderId": 3,
                  "insurerId": "AVV",
                  "productName": "MyProtector Level Plus with CI",
                  "purposeId": 1,
                  "objectiveId": 1,
                  "typeId": 1,
                  "promoId": 0,
                  "searchCount": 0,
                  "whyBuy": "I am concerned that I may have to stop work temporarily due to a critical illness and hence income loss.",
                  "payOut": "A lump sum benefit upon critical illness (CI), death or terminal illness (TI).",
                  "underWritting": "Yes",
                  "rebate": "Eligible",
                  "cashValue": "No",
                  "cashPayoutFrequency": "",
                  "coverageDuration": "At least 5 years, to age 99 (max)",
                  "premiumDuration": "Throughout policy duration",
                  "features": "Option to increase cover at key life stages.~5-yr or 10-yr Term can be renewed.~Covers 36 CI definitions instead of 30.~Unique riders like Male/Female Illness cover available.~Multi-currency available.",
                  "productDescription": "This Term policy provides high protection at low cost with critical illness (CI), death and TI benefits. CI benefit is payable if one is diagnosed with any of the 37 illness definitions such as Major Cancer, Heart Attack and Stroke. This policy allows the option to increase death benefit at key life stages without health underwriting. If 5-year or 10-year Term is chosen, it can renew for another 5/10 years at the end of the Term duration. Six currency options are available: SGD, USD, GBP, EUR, AUD and HKD. You can also attach optional riders like TPD to enhance its benefits.",
                  "status": "Expired",
                  "brochureLink": null,
                  "lastUpdated": "2017-01-13T07:30:00.020+0000",
                  "lastUpdatedBy": null,
                  "insurer": {
                    "id": 0,
                    "insurerName": "Aviva",
                    "logoName": "logo-aviva.png",
                    "url": "https://www.aviva.com.sg",
                    "lastUpdatedTime": null,
                    "rating": "1",
                    "lastUpdatedBy": null
                  },
                  "premium": {
                    "id": 0,
                    "productId": null,
                    "gender": "Female",
                    "minimumAge": 40,
                    "coverageName": "between 41 to 75",
                    "durationName": "$6,000",
                    "premiumTerm": "10",
                    "savingsDuration": "",
                    "retirementPayourAmount": "$6,000",
                    "retirementPayourDuration": "lifetime",
                    "premiumAmount": "14289",
                    "premiumFrequency": "per year",
                    "intrestRateOfReturn": "3.79",
                    "ranking": 3,
                    "riderId": 0,
                    "lastUpdatedDate": null,
                    "lastUpdatedBy": null
                  },
                  "promotion": {
                    "insurerId": 0,
                    "thumbnail": "manulife_premum_discount.jpg",
                    "promoDiscount": "*10% OFF",
                    "promoTitle": "Manulife RetireReady First Year Premium Discount Campaign (Extended)",
                    "description": "Receive discount on your first year premium, when you sign up for RetireReady with Manulife!",
                    "link": "ntuclink.com/link1",
                    "expired": "TRUE",
                    "expiredDate": "2016-01-24T15:30:00.059+0000",
                    "lastUpdatedTime": null,
                    "lastUpdatedBy": null
                  },
                  "authorised": true
                }
              ]
            }, {
              "protectionType": "Critical Illness",
              "protectionTypeDescription": "Critical Illness",
              "productList": [{
                  "id": null,
                  "riderId": 3,
                  "insurerId": "MNL",
                  "productName": "3G (I)",
                  "purposeId": 3,
                  "objectiveId": 10,
                  "typeId": 14,
                  "promoId": 1,
                  "searchCount": 0,
                  "whyBuy": "I want a stream of income payout for my entire life and a bequest upon death.",
                  "payOut": "A stream of lifelong income payout with amount that can vary from year to year and a lump sum benefit upon death.",
                  "underWritting": "Yes",
                  "rebate": "Eligible",
                  "cashValue": "Yes",
                  "cashPayoutFrequency": "Yearly income starts after Year 10",
                  "coverageDuration": "Whole life",
                  "premiumDuration": "10 years",
                  "features": "High death, TI and TPD benefits.",
                  "productDescription": "This Whole Life policy requires only 10 years of premium payment, after which a stream of Yearly Cash Coupons are paid out starting from the 10th policy year. Each Yearly Cash Coupon comprises of (a) a guaranteed amount at 2% of sum assured and (b) a projected non-guaranteed bonus. This policy is available for ages 0 to 60. The policy offers death, TI and TPD benefits, in which 100% of Sum Assured and projected bonuses (if any) are payable.",
                  "status": "Expired",
                  "brochureLink": null,
                  "lastUpdated": "2017-01-05T08:30:00.032+0000",
                  "lastUpdatedBy": null,
                  "insurer": {
                    "id": 0,
                    "insurerName": "Manulife",
                    "logoName": "logo-manulife.png\t",
                    "url": "https://www.manulife.com.sg",
                    "lastUpdatedTime": null,
                    "rating": "2",
                    "lastUpdatedBy": null
                  },
                  "premium": {
                    "id": 0,
                    "productId": null,
                    "gender": "Female",
                    "minimumAge": 40,
                    "coverageName": "between 41 to 75",
                    "durationName": "$6,000",
                    "premiumTerm": "10",
                    "savingsDuration": "",
                    "retirementPayourAmount": "$6,000",
                    "retirementPayourDuration": "lifetime",
                    "premiumAmount": "14289",
                    "premiumFrequency": "per year",
                    "intrestRateOfReturn": "3.79",
                    "ranking": 3,
                    "riderId": 0,
                    "lastUpdatedDate": null,
                    "lastUpdatedBy": null
                  },
                  "promotion": {
                    "insurerId": 0,
                    "thumbnail": null,
                    "promoDiscount": null,
                    "promoTitle": null,
                    "description": null,
                    "link": null,
                    "expired": null,
                    "expiredDate": null,
                    "lastUpdatedTime": null,
                    "lastUpdatedBy": null
                  },
                  "authorised": true
                }
              ]
            }
          ],
          "securityToken": "jsdki929nsd92293nskd12wei230"
        }
      ]
    };
  }
}
