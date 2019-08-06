import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { CurrencyPipe, Location } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgbCarouselConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SlickComponent } from 'ngx-slick';
import { Subscription } from 'rxjs';

import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '../../../../node_modules/@angular/router';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SelectedPlansService } from '../../shared/Services/selected-plans.service';
import { StateStoreService } from '../../shared/Services/state-store.service';
import { GuideMeCalculateService } from '../guide-me-calculate.service';
import { GuideMeApiService } from '../guide-me.api.service';
import { GuideMeService } from '../guide-me.service';
import { CreateAccountModelComponent } from './create-account-model/create-account-model.component';
import { RecommendationsState } from './recommendations.state';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbCarouselConfig]
})
export class RecommendationsComponent implements IPageComponent, OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('recommendationCarousel') recommendationCarousel: SlickComponent;
  @ViewChild('mobileHeaderMenu', { read: ElementRef }) mobileHeaderMenu: ElementRef<any>;

  pageTitle: string;
  subTitle: string;

  slideConfig = { slidesToShow: 1, slidesToScroll: 1, infinite: false };
  modalRef: NgbModalRef;

  routeSubscription: Subscription;
  state: RecommendationsState;
  componentName: string;

  constructor(
    private carouselConfig: NgbCarouselConfig, private elRef: ElementRef,
    private translate: TranslateService, public navbarService: NavbarService,
    private guideMeApiService: GuideMeApiService, private calculateService: GuideMeCalculateService,
    private currency: CurrencyPipe, private guideMeService: GuideMeService,
    private selectedPlansService: SelectedPlansService, public modal: NgbModal, private router: Router,
    private stateStoreService: StateStoreService, private route: ActivatedRoute,
    private location: Location, private authService: AuthenticationService) {

    /* ************** STATE HANDLING - START ***************** */
    this.componentName = this.route.routeConfig.component.name;

    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !this.authService.isSignedUser()) {
        this.stateStoreService.saveState(this.componentName, this.state);
      } else if (event instanceof NavigationEnd) {

      }
    });
    if (this.stateStoreService.has(this.componentName)) {
      this.state = this.stateStoreService.getState(this.componentName);
    } else {
      this.state = new RecommendationsState();
    }

    this.location.subscribe((popStateEvent: PopStateEvent) => {
      if (popStateEvent.type === 'popstate') {
        const eventSubscription = this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.stateStoreService.clearState(this.componentName);
            eventSubscription.unsubscribe();

          }
        });
      }
    });
    /* ************** STATE HANDLING - END ***************** */

    this.carouselConfig.wrap = false;
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RECOMMENDATIONS.TITLE');
      this.subTitle = this.translate.instant('RECOMMENDATIONS.DESCRIPTION');
      this.state.protectionNeedTypes = this.translate.instant('PROTECTION_NEED_TYPES');
      this.state.perMonth = this.translate.instant('SUFFIX.PER_MONTH');
      this.state.perYear = this.translate.instant('SUFFIX.PER_YEAR');
      this.setPageTitle(this.pageTitle, this.subTitle);
      this.state.pageTitle = this.pageTitle;
      this.state.subTitle = this.subTitle;
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.guideMeService.clearProtectionNeedsData();
    setTimeout(() => {
      if (!this.stateStoreService.has(this.componentName) && (!this.state || !this.state.enquiryId)) {
        this.getRecommendationsFromServer();
      }
    }, 500);

    this.state.recommendationCarousel = this.recommendationCarousel;
    this.state.mobileHeaderMenu = this.mobileHeaderMenu;
  }

  ngOnDestroy() {
    if (this.routeSubscription instanceof Subscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.state.enableScroll = true;
  }

  afterChange(e) {
    this.state.currentSlide = e.currentSlide;
    this.state.activeRecommendationList = this.state.recommendationPlans[this.state.currentSlide];
    this.state.activeRecommendationType = this.state.activeRecommendationList.protectionType;

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
          this.state.resultsEmptyMessage = data.responseMessage.responseDescription;
          return;
        }
        this.state.resultsEmptyMessage = '';
        this.state.recommendationPlans = data.objectList[0].productProtectionTypeList;
        this.state.enquiryId = data.objectList[0].enquiryId;
        this.state.activeRecommendationType = this.state.recommendationPlans[0].protectionType;
        this.state.activeRecommendationList = this.state.recommendationPlans[0];
        this.updateCoverageDetails();
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.state.innerWidth = window.innerWidth;
  }

  setPageTitle(title: string, subTitle: string) {
    this.navbarService.setPageTitle(title, subTitle);
  }

  moveCarouselNext() {
    const container = this.elRef.nativeElement.querySelector('#mobileHeaderMenu');
    const containerBound = container.getBoundingClientRect();
    const boundElement = container.querySelector('.' + this.state.activeRecommendationType.replace(' ', '-'));
    if (boundElement) {
      const bound = boundElement.getBoundingClientRect();
      if (bound.right > containerBound.right) {
        this.state.mobileHeaderMenu.nativeElement.scrollTo(
          {
            left: (this.state.mobileHeaderMenu.nativeElement.scrollLeft + bound.width),
            behavior: 'smooth'
          });
      }
    }
  }

  moveCarouselPrev() {
    const container = this.elRef.nativeElement.querySelector('#mobileHeaderMenu');
    const containerBound = container.getBoundingClientRect();
    const boundElement = container.querySelector('.' + this.state.activeRecommendationType.replace(' ', '-'));
    if (boundElement) {
      const bound = boundElement.getBoundingClientRect();
      if (bound.left < containerBound.left) {
        this.state.mobileHeaderMenu.nativeElement.scrollTo(
          {
            left: (this.state.mobileHeaderMenu.nativeElement.scrollLeft - bound.width),
            behavior: 'smooth'
          });
      }
    }
  }

  slideCarousel(event) {
    if (event.direction === 'left') {
      this.state.prevActiveSlide = event.prev;
    } else {
      this.state.nextActiveSlide = event.prev;
    }
    this.state.activeRecommendationType = event.current;
    this.state.activeRecommendationList = this.getCurrentRecommendationList();
    this.updateCoverageDetails();
  }

  jumpToSlide(recommendation, index) {
    this.state.recommendationCarousel.slickGoTo(index);
    this.state.activeRecommendationType = recommendation.protectionType;
    this.state.activeRecommendationList = recommendation;
    this.updateCoverageDetails();
  }

  getCurrentRecommendationList() {
    return this.state.recommendationPlans[this.state.currentSlide];
  }

  updateCoverageDetails() {
    if (this.state.activeRecommendationList.productList[0]) {
      const data = this.state.activeRecommendationList.productList[0];
      this.state.premiumFrom = data.premium.premiumAmount;

      this.state.premiumFrequency = this.state.perMonth;

      switch (this.state.activeRecommendationType) {
        case this.state.protectionNeedTypes.LIFE_PROTECTION:
          //this.coverageAmount = this.calculateService.getLifeProtectionData().coverageAmount + '';
          break;
        case this.state.protectionNeedTypes.CRITICAL_ILLNESS:
          //const criticalIllnessValues = this.calculateService.getCriticalIllnessData();
          //this.coverageAmount = criticalIllnessValues.coverageAmount + '';
          break;
        case this.state.protectionNeedTypes.OCCUPATION_DISABILITY:
          //const ocpData = this.calculateService.getOcpData();
          //this.coverageAmount = ocpData.coverageAmount + '';
          break;
        case this.state.protectionNeedTypes.LONG_TERM_CARE:
        case this.state.protectionNeedTypes.HOSPITAL_PLAN:
          //const ltcData = this.calculateService.getLtcData();
          //this.coverageAmount = ltcData.monthlyPayout + '';
          this.state.premiumFrom = data.premium.premiumAmountYearly;
          this.state.premiumFrequency = this.state.perYear;
          break;
      }

      this.state.coverageAmount = data.premium.sumAssured;

    } else {
      this.state.coverageAmount = '';
      this.state.premiumFrom = '';
    }
  }

  viewDetails(plan) {
  }

  selectPlan(data) {
    const index: number = this.state.selectedPlans.indexOf(data.plan);
    if (data.selected) {
      if (index === -1) {
        this.state.selectedPlans.push(data.plan);
      }
    } else {
      if (index !== -1) {
        this.state.selectedPlans.splice(index, 1);
      }
    }
    this.updatePlanData(data.plan);
  }

  updatePlanData(plan) {
    this.state.recommendationPlans = this.state.recommendationPlans
      .map((item) => {
        if (item.id === plan.id) {
          return plan;
        }
        return item;
      });
  }

  proceed() {
    this.selectedPlansService.setSelectedPlan(this.state.selectedPlans, this.state.enquiryId);
    if (this.authService.isSignedUser()) {
      this.selectedPlansService.updateInsuranceEnquiry().subscribe((data) => {
        if (data.responseMessage.responseCode === 6000) {
          this.selectedPlansService.clearData();
          this.stateStoreService.clearState(this.componentName);
          this.guideMeService.checkGuidedDataLoaded('true');
          this.router.navigate(['email-enquiry/success']);
        }
      });
    } else {
      this.modalRef = this.modal.open(CreateAccountModelComponent, {
        centered: true
      });
      this.modalRef.componentInstance.data = this.state.selectedPlans.length;
    }
  }
}
