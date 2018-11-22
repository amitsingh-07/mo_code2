import { ElementRef, ViewChild } from '@angular/core';
import { SlickComponent } from 'ngx-slick';

export class RecommendationsState {

    @ViewChild('recommendationCarousel') recommendationCarousel: SlickComponent;
    @ViewChild('mobileHeaderMenu', { read: ElementRef }) public mobileHeaderMenu: ElementRef<any>;

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
