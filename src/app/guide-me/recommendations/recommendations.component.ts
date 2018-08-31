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
    if (data.selected) {
      console.log(data.plan);
      this.selectedPlans.push(data.plan);
    } else {
      const index: number = this.selectedPlans.indexOf(data.plan);
      if (index !== -1) {
        this.selectedPlans.splice(index, 1);
      }
    }
  }

  proceed() {
    const ref = this.modal.open(CreateAccountModelComponent, {
      windowClass: 'position-bottom',
      centered: true
    });
    ref.componentInstance.data = this.selectedPlans.length;
  }
}
