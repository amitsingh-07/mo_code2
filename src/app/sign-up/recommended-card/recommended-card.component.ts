import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { RecommendedCardModalComponent } from '../recommended-card-modal/recommended-card-modal.component';
import { SignUpApiService } from '../sign-up.api.service';
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
      cardId: 1,
      headLine: 'This is Headline',
      subTitle: 'This is subTitle after headline',
      coverImageKey: '5',
      isCardRead: false
    },
    {
      cardId: 2,
      headLine: 'This is Headline',
      subTitle: 'This is subTitle after headline',
      coverImageKey: '9',
      isCardRead: false
    },
    {
      cardId: 3,
      headLine: 'This is Headline',
      subTitle: 'This is subTitle after headline',
      coverImageKey: '2',
      isCardRead: true
    },
    {
      cardId: 4,
      headLine: 'This is Headline',
      subTitle: 'This is subTitle after headline',
      coverImageKey: '11',
      isCardRead: true
    },
    {
      cardId: 5,
      headLine: 'This is Headline',
      subTitle: 'This is subTitle after headline',
      coverImageKey: '7',
      isCardRead: true
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
    private signUpService: SignUpService,
    private signUpApiService: SignUpApiService
  ) { }

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
        // Dismiss API call goes here
        this.signUpApiService.dismissCard(cardId).subscribe(dismissResp => {

        })
      });
    }, err => {
      
    })
  }

  getIcon(iconKey) {
    return `${this.iconSrcPath}list-icon-${iconKey}.svg`;
  }

  getRecommendedCards() {
    // API CALL GOES HERE
  }
}
