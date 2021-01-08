import { ElementRef } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

export class RecommendationsState {

    recommendationCarousel: SlickCarouselComponent;
    mobileHeaderMenu: ElementRef<any>;

    pageTitle: string;
    subTitle: string;

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

    innerWidth: any;
    currentSlide = 0;
    ciCoverageAmount = '';
}
