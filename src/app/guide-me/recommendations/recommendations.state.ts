import { ElementRef } from '@angular/core';
import { SlickComponent } from 'ngx-slick';

export class RecommendationsState {

    recommendationCarousel: SlickComponent;
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
}
