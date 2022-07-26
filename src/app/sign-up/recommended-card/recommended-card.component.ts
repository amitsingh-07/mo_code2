import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { RecommendedCardModalComponent } from '../recommended-card-modal/recommended-card-modal.component';
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
    nextArrow: '<div class="next-arrow"><span style="font-size: 60px;" class="fa fa-angle-right"></span></div>',
    prevArrow: '<div class="prev-arrow"><span style="font-size: 60px;" class="fa fa-angle-left"></span></div>',
    autoplay: false,
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
    ]
  };
  currentSlide = 0;
  @ViewChild('carousel') carousel: SlickCarouselComponent;
  iconSrcPath = 'assets/images/recommended-card/'
  constructor(
    public modal: NgbModal,
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
    const ref = this.modal.open(RecommendedCardModalComponent, { centered: true });
    ref.componentInstance.closeAction.subscribe((value: any) => {
      // Dismiss API call goes here
    });
  }

  getIcon(iconId) {
    return `${this.iconSrcPath}list-icon-${iconId}.svg`;
  }

  getRecommendedCards() {
    // API CALL GOES HERE
  }
}
