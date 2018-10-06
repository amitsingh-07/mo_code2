import { CurrencyPipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SlickComponent } from 'ngx-slick';

import { Router } from '../../../../node_modules/@angular/router';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SelectedPlansService } from '../../shared/Services/selected-plans.service';
import { GuideMeCalculateService } from '../guide-me-calculate.service';
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
export class RecommendationsComponent implements IPageComponent, OnInit, AfterViewChecked {
  pageTitle: string;
  subTitle: string;

  modalRef: NgbModalRef;
  resultsEmptyMessage = '';
  recommendationPlans;
  selectedPlans: any[] = [];
  coverageAmount = '';
  premiumFrom = '';
  perMonth = '';
  perYear = '';
  premiumFrequency = '';

  activeRecommendationType;
  activeRecommendationList;
  enquiryId;
  protectionNeedTypes;

  enableScroll = false;

  prevActiveSlide;
  nextActiveSlide;

  public innerWidth: any;
  currentSlide = 0;
  slideConfig = { slidesToShow: 1, slidesToScroll: 1, infinite: false };

  @ViewChild('recommendationCarousel') recommendationCarousel: SlickComponent;
  @ViewChild('mobileHeaderMenu', { read: ElementRef }) public mobileHeaderMenu: ElementRef<any>;

  constructor(
    private carouselConfig: NgbCarouselConfig, private elRef: ElementRef,
    private translate: TranslateService, public navbarService: NavbarService,
    private guideMeApiService: GuideMeApiService, private calculateService: GuideMeCalculateService,
    private currency: CurrencyPipe, private guideMeService: GuideMeService,
    private selectedPlansService: SelectedPlansService, public modal: NgbModal, private router: Router) {
    this.carouselConfig.wrap = false;
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RECOMMENDATIONS.TITLE');
      this.subTitle = this.translate.instant('RECOMMENDATIONS.DESCRIPTION');
      this.protectionNeedTypes = this.translate.instant('PROTECTION_NEED_TYPES');
      this.perMonth = this.translate.instant('SUFFIX.PER_MONTH');
      this.perYear = this.translate.instant('SUFFIX.PER_YEAR');
      this.setPageTitle(this.pageTitle, this.subTitle);
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.getRecommendationsFromServer();
    }, 500);
  }

  ngAfterViewChecked() {
    this.enableScroll = true;
  }

  afterChange(e) {
    this.currentSlide = e.currentSlide;
    this.activeRecommendationList = this.recommendationPlans[this.currentSlide];
    this.activeRecommendationType = this.activeRecommendationList.protectionType;

    this.updateCoverageDetails();
    switch (e.slick.currentDirection) {
      // Left
      case 0:
        this.moveCarouselNext();
        break;
      case 1:
        this.moveCarouselPrev();
        break;
    }
  }

  getRecommendationsFromServer() {
    this.guideMeApiService.getRecommendations().subscribe(
      (data) => {
        window.scrollTo(0, 0);
        if (data.responseMessage.responseCode === 6004) {
          this.resultsEmptyMessage = data.responseMessage.responseDescription;
          return;
        }
        this.resultsEmptyMessage = '';
        this.recommendationPlans = data.objectList[0].productProtectionTypeList;
        this.enquiryId = data.objectList[0].enquiryId;
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
    this.navbarService.setPageTitle(title, subTitle);
  }

  moveCarouselNext() {
    const container = this.elRef.nativeElement.querySelector('#mobileHeaderMenu');
    const containerBound = container.getBoundingClientRect();
    const boundElement = container.querySelector('[data-type=\'' + this.activeRecommendationType + '\'');
    if (boundElement) {
      const bound = boundElement.getBoundingClientRect();
      if (bound.right > containerBound.right) {
        this.mobileHeaderMenu.nativeElement.scrollTo(
          {
            left: (this.mobileHeaderMenu.nativeElement.scrollLeft + bound.width),
            behavior: 'smooth'
          });
      }
    }
  }

  moveCarouselPrev() {
    const container = this.elRef.nativeElement.querySelector('#mobileHeaderMenu');
    const containerBound = container.getBoundingClientRect();
    const boundElement = container.querySelector('[data-type=\'' + this.activeRecommendationType + '\'');
    if (boundElement) {
      const bound = boundElement.getBoundingClientRect();
      if (bound.left < containerBound.left) {
        this.mobileHeaderMenu.nativeElement.scrollTo(
          {
            left: (this.mobileHeaderMenu.nativeElement.scrollLeft - bound.width),
            behavior: 'smooth'
          });
      }
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

  jumpToSlide(recommendation, index) {
    this.recommendationCarousel.slickGoTo(index);
    this.activeRecommendationType = recommendation.protectionType;
    this.activeRecommendationList = recommendation;
    this.updateCoverageDetails();
  }

  getCurrentRecommendationList() {
    return this.recommendationPlans[this.currentSlide];
  }

  updateCoverageDetails() {
    if (this.activeRecommendationList.productList[0]) {
      const data = this.activeRecommendationList.productList[0];
      this.premiumFrom = data.premium.premiumAmount;
      if (data.premium.premiumFrequency === 'per month') {
        this.premiumFrequency = this.perMonth;
      } else if (data.premium.premiumFrequency === 'per year') {
        this.premiumFrequency = this.perYear;
      }
      switch (this.activeRecommendationType) {
        case this.protectionNeedTypes.LIFE_PROTECTION:
          this.coverageAmount = this.calculateService.getLifeProtectionData().coverageAmount + '';
          break;
        case this.protectionNeedTypes.CRITICAL_ILLNESS:
          const criticalIllnessValues = this.calculateService.getCriticalIllnessData();
          this.coverageAmount = criticalIllnessValues.coverageAmount + '';
          break;
        case this.protectionNeedTypes.OCCUPATION_DISABILITY:
          const ocpData = this.calculateService.getOcpData();
          this.coverageAmount = ocpData.coverageAmount + '';
          break;
        case this.protectionNeedTypes.LONG_TERM_CARE:
          const ltcData = this.calculateService.getLtcData();
          this.coverageAmount = ltcData.monthlyPayout + '';
          break;
        case this.protectionNeedTypes.HOSPITAL_PLAN:
          this.coverageAmount = '';
          break;
      }
    } else {
      this.coverageAmount = '';
      this.premiumFrom = '';
    }
  }

  viewDetails(plan) {
  }

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

  proceed() {
    this.selectedPlansService.setSelectedPlan(this.selectedPlans, this.enquiryId);
    this.modalRef = this.modal.open(CreateAccountModelComponent, {
      windowClass: 'position-bottom',
      centered: true
    });
    this.modalRef.componentInstance.data = this.selectedPlans.length;
  }
}
