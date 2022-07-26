import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-recommended-card',
  templateUrl: './recommended-card.component.html',
  styleUrls: ['./recommended-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecommendedCardComponent implements OnInit {

  cards = [
    {
      id: 1,
      healdine: 'This is Headline',
      subtitle: 'This is Subtitle after headline',
      iconKey: '5',
      is_read: false
    },
    {
      id: 2,
      healdine: 'This is Headline',
      subtitle: 'This is Subtitle after headline',
      iconKey: '9',
      is_read: false
    },
    {
      id: 3,
      healdine: 'This is Headline',
      subtitle: 'This is Subtitle after headline',
      iconKey: '2',
      is_read: true
    },
    {
      id: 4,
      healdine: 'This is Headline',
      subtitle: 'This is Subtitle after headline',
      iconKey: '11',
      is_read: true
    },
    {
      id: 5,
      healdine: 'This is Headline',
      subtitle: 'This is Subtitle after headline',
      iconKey: '7',
      is_read: true
    }
  ];
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
  iconSrcPath = 'assets/images/recommended-card/'
  constructor(
    private signUpService: SignUpService
  ) { }

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
    return `${this.iconSrcPath}list-icon-${iconId}.svg`;
  }

  getRecommendedCards() {
    // API CALL GOES HERE
  }
}
