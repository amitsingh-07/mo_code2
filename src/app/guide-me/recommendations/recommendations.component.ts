import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecommendationsComponent implements OnInit {

  recommendationPlans;
  activeRecommendationType;
  prevActiveSlide;
  nextActiveSlide;
  @ViewChild('recommendationCarousel') recommendationCarousel: NgbCarousel;

  constructor() {

  }

  ngOnInit() {
    this.recommendationPlans = [{
      "type": "Life Protection",
      "plan": [{
        "name": "MyProtector Term with CI",
        "amount": "122.70",
        "offercaption": "5% discount for cover of $1.1 onwards",
        "features": [{
          "title": "1",
          "caption": "Ranking by Price"
        },
        {
          "title": "AA-",
          "caption": "Insurer's Rating"
        },
        {
          "title": "50%",
          "caption": "Commission Rebate"
        }
        ],
        "coverageDuration": "30 Years",
        "PremiumDuration": "Throughout Policy Term",
        "medicalUnderwritingRequired": true
      },
      {
        "name": "MyProtector Life without CI",
        "amount": "91.54",
        "offercaption": "25% discount for cover of $1.1 onwards",
        "features": [{
          "title": "2",
          "caption": "Ranking by Price"
        },
        {
          "title": "AA",
          "caption": "Insurer's Rating"
        },
        {
          "title": "30%",
          "caption": "Commission Rebate"
        }
        ],
        "coverageDuration": "15 Years",
        "PremiumDuration": "5 Years",
        "medicalUnderwritingRequired": false
      }
      ]
    },
    {
      "type": "Critical Illness",
      "plan": [{
        "name": "Critical Illness with CI",
        "amount": "91.5",
        "offercaption": "15% discount for cover of $1.1 onwards",
        "features": [{
          "title": "78%",
          "caption": "Rebate"
        },
        {
          "title": "AA-",
          "caption": "Insurer's Rating"
        },
        {
          "title": "50%",
          "caption": "Commission Rebate"
        }
        ],
        "coverageDuration": "15 Years",
        "PremiumDuration": "Throughout Policy Term",
        "medicalUnderwritingRequired": true
      },
      {
        "name": "Critical Illness without CI",
        "amount": "91.54",
        "offercaption": "25% discount for cover of $1.1 onwards",
        "features": [{
          "title": "1",
          "caption": "Ranking by Price"
        },
        {
          "title": "B",
          "caption": "Insurer's Rating"
        },
        {
          "title": "70%",
          "caption": "Commission Rebate"
        }
        ],
        "coverageDuration": "25 Years",
        "PremiumDuration": "10 Years",
        "medicalUnderwritingRequired": true
      }
      ]
    },
    {
      "type": "Long Term Care",
      "plan": [{
        "name": "Long Term Care with CI",
        "amount": "122.70",
        "offercaption": "65% discount for cover of $1.1 onwards",
        "features": [{
          "title": "1",
          "caption": "Ranking by Price"
        },
        {
          "title": "AA-",
          "caption": "Insurer's Rating"
        },
        {
          "title": "50%",
          "caption": "Commission Rebate"
        }
        ],
        "coverageDuration": "20 Years",
        "PremiumDuration": "Throughout Policy Term",
        "medicalUnderwritingRequired": true
      },
      {
        "name": "Long Term Care without CI",
        "amount": "91.54",
        "offercaption": "15% discount for cover of $1.1 onwards",
        "features": [{
          "title": "2",
          "caption": "Ranking by Price"
        },
        {
          "title": "AA",
          "caption": "Insurer's Rating"
        },
        {
          "title": "90%",
          "caption": "Commission Rebate"
        }
        ],
        "coverageDuration": "15 Years",
        "PremiumDuration": "5 Years",
        "medicalUnderwritingRequired": false
      }
      ]
    }
    ];

    this.activeRecommendationType = this.recommendationPlans[0].type;

  }

  moveCarouselNext() {
    this.recommendationCarousel.next();
  }

  moveCarouselPrev() {
    this.recommendationCarousel.prev();
  }

  slideCarousel(event) {
    if (event.direction === 'left') {
      this.prevActiveSlide = event.prev;
    } else {
      this.nextActiveSlide = event.prev;
    }
    this.activeRecommendationType = event.current;
  }

  jumpToSlide(type) {
    this.recommendationCarousel.activeId = type;
    this.activeRecommendationType = type;
  }

}
