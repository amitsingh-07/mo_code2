import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { RecommendedCardModalComponent } from '../recommended-card-modal/recommended-card-modal.component';
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
    slidesToShow: SIGN_UP_CONFIG.RECOMMENDED_CARD.CAROUSEL_CONFIG.SLIDES_TO_SHOW_DESKTOP,
    slidesToScroll: SIGN_UP_CONFIG.RECOMMENDED_CARD.CAROUSEL_CONFIG.SLIDES_TO_SCROLL,
    nextArrow: '<div class="next-arrow circle"><img src="assets/images/arrow-right.svg" alt="" /></div>',
    prevArrow: '<div class="prev-arrow circle"><img src="assets/images/arrow-left.svg" alt="" /></div>',
    autoplay: false,
    dots: false,
    infinite: false,
    variableWidth: true,
    responsive: [
      {
        breakpoint: SIGN_UP_CONFIG.RECOMMENDED_CARD.CAROUSEL_CONFIG.SCREEN_SIZE,
        settings: {
          slidesToShow: SIGN_UP_CONFIG.RECOMMENDED_CARD.CAROUSEL_CONFIG.SLIDES_TO_SHOW_MOB,
          slidesToScroll: SIGN_UP_CONFIG.RECOMMENDED_CARD.CAROUSEL_CONFIG.SLIDES_TO_SCROLL
        }
      },
    ]
  };
  currentSlide = 0;
  @ViewChild('carousel') carousel: SlickCarouselComponent;
  iconSrcPath = SIGN_UP_CONFIG.RECOMMENDED_CARD.ICONS_PATH;
  isLoadComplete = false;
  constructor(
    public modal: NgbModal,
    private signUpApiService: SignUpApiService,
    private readonly translate: TranslateService,
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
    // Based on card id, make API call to get Card Content
    this.signUpApiService.getCardById(cardId).subscribe((resp: any) => {
      const ref = this.modal.open(RecommendedCardModalComponent, { centered: true, windowClass: 'recommended-card-modal' });
      ref.componentInstance.cardContent = resp.objectList; // Pass card content here
      ref.componentInstance.closeAction.subscribe((value: any) => {
        this.isLoadComplete = false;
        this.cards = [];
        if (value) {
          // Dismiss API call goes here
          this.signUpApiService.dismissCard(cardId).subscribe(dismissResp => {
            this.getRecommendedCards();
          });
        } else {
          this.getRecommendedCards();
        }
      });
    }, err => {

    })
  }

  getIcon(iconId) {
    return `${this.iconSrcPath}${iconId}`;
  }

  getRecommendedCards() {
    // API CALL GOES HERE
    this.signUpApiService.getCardsByPageSizeAndNo(SIGN_UP_CONFIG.RECOMMENDED_CARD.PAGE_SIZE, SIGN_UP_CONFIG.RECOMMENDED_CARD.PAGE_COUNT).subscribe((resp: any) => {
      this.isLoadComplete = true;
      const responseCode = resp && resp.responseMessage && resp.responseMessage.responseCode ? resp.responseMessage.responseCode : 0;
      if (responseCode >= 6000) {
        this.cards = resp.objectList.pageList;
      }
    }, err => {
      this.isLoadComplete = true;
    });
  }

  afterSlideChange(event) {
    const nextArrow: any = document.getElementsByClassName('next-arrow');
    const prevArrow: any = document.getElementsByClassName('prev-arrow');
    if (event.currentSlide + 2 == this.cards.length) {
      nextArrow[0].style.display = 'none';
    } else {
      nextArrow[0].style.display = 'inherit';
    }

    if (event.first) {
      prevArrow[0].style.display = 'none';
    } else {
      prevArrow[0].style.display = 'inherit';
    }
  }

  slickInit(e) {
    const prevArrow: any = document.getElementsByClassName('prev-arrow');
    prevArrow[0].style.display = 'none';
  }
}
