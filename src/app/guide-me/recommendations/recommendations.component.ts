import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { SelectedPlansService } from '../../shared/Services/selected-plans.service';
import { CriticalIllnessData } from '../ci-assessment/ci-assessment';
import { GuideMeCalculateService } from '../guide-me-calculate.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeApiService } from '../guide-me.api.service';
import { GuideMeService } from '../guide-me.service';
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

  modalRef: NgbModalRef;
  recommendationPlans;
  selectedPlans: any[] = [];
  coverageAmount = '';
  premiumFrom = '';
  comparePlans: any[] = [];
  activeRecommendationType;
  activeRecommendationList;
  isComparePlanEnabled = false;

  prevActiveSlide;
  nextActiveSlide;

  public innerWidth: any;
  @ViewChild('recommendationCarousel') recommendationCarousel: NgbCarousel;
  @ViewChild('mobileHeaderMenu', { read: ElementRef }) public mobileHeaderMenu: ElementRef<any>;

  constructor(
    private carouselConfig: NgbCarouselConfig, private elRef: ElementRef,
    private translate: TranslateService, public headerService: HeaderService,
    private guideMeApiService: GuideMeApiService, private guideMeCalculateService: GuideMeCalculateService,
    private currency: CurrencyPipe, private guideMeService: GuideMeService,
    private selectedPlansService: SelectedPlansService, public modal: NgbModal, private router: Router) {
    this.carouselConfig.wrap = false;
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RECOMMENDATIONS.TITLE');
      this.subTitle = this.translate.instant('RECOMMENDATIONS.DESCRIPTION');
      this.setPageTitle(this.pageTitle, this.subTitle);
    });
  }

  ngOnInit() {
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
  }

  // tslint:disable-next-line:member-ordering
  Brochure = (() => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    return ((data, fileName) => {
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: 'octet/stream' });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  })();

  selectPlan(data) {
    const index: number = this.selectedPlans.indexOf(data.plan);
    if (data.selected) {
      if (index === -1) {
        this.selectedPlans.push(data.plan);
      }
    } else {
      if (index !== -1) {
        this.selectedPlans.splice(index, 1);
      }
    }
  }
  comparePlan(data) {
    if (data.selected) {
      this.comparePlans.push(data.plan);
    } else {
      const index: number = this.comparePlans.indexOf(data.plan);
      if (index !== -1) {
        this.comparePlans.splice(index, 1);
      }
    }
  }
  compare() {
    this.guideMeService.setPlanDetails(this.comparePlans);
    this.router.navigate([GUIDE_ME_ROUTE_PATHS.COMPARE_PLANS]);
  }
  EnablecomparePlan() {
    this.isComparePlanEnabled = !this.isComparePlanEnabled;
  }
  proceed() {
    this.selectedPlansService.setSelectedPlan(this.selectedPlans);
    this.modalRef = this.modal.open(CreateAccountModelComponent, {
      windowClass: 'position-bottom',
      centered: true
    });
    this.modalRef.componentInstance.data = this.selectedPlans.length;
  }
}

