import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';

@Component({
  selector: 'app-recommended-card',
  templateUrl: './recommended-card.component.html',
  styleUrls: ['./recommended-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecommendedCardComponent implements OnInit {

  cards = [];
  slideConfig = {
    slidesToShow: 2.5,
    slidesToScroll: 1,
    nextArrow: '<div class="next-arrow circle"><img src="assets/images/arrow-right.svg" alt="" /></div>',
    prevArrow: '<div class="prev-arrow circle"><img src="assets/images/arrow-left.svg" alt="" /></div>',
    autoplay: false,
    dots: false,
    infinite: false,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1
        }
      },
    ]
  };
  currentSlide = 0;
  @ViewChild('carousel') carousel: SlickCarouselComponent;
  iconSrcPath = SIGN_UP_CONFIG.RECOMMENDED_CARD.ICONS_PATH;
  constructor(
    private readonly translate: TranslateService,
    private signupApiService: SignUpApiService
  ) { 
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.getRecommendedCards();
  }

  // Setting the next slide index on beforeChange event fire
  beforeSlideChange(e) {
    this.currentSlide = e.nextSlide;
  }

  openCard(cardId) {
    console.log('card id', cardId);
  }

  getIcon(iconId) {
    return `${this.iconSrcPath}${iconId}`;
  }

  getRecommendedCards() {
    // API CALL GOES HERE
    this.signupApiService.getCardsByPageSizeAndNo(0, 5).subscribe((resp: any) => {
      const responseCode = resp && resp.responseMessage && resp.responseMessage.responseCode ? resp.responseMessage.responseCode : 0;
      if (responseCode >= 6000) {
        this.cards = resp.objectList.pageList;
      }
    }, err => {

    });
  }
}
