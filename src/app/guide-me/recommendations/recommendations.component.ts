import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { HeaderService } from './../../shared/header/header.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbCarouselConfig]
})
export class RecommendationsComponent implements IPageComponent, OnInit {
  pageTitle: string;
  subTitle: string;

  recommendationPlans;
  selectedPlans: any[] = [];

  activeRecommendationType;

  prevActiveSlide;
  nextActiveSlide;

  public innerWidth: any;
  @ViewChild('recommendationCarousel') recommendationCarousel: NgbCarousel;
  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;

  constructor(
    private carouselConfig: NgbCarouselConfig, private elRef: ElementRef,
    private translate: TranslateService, public headerService: HeaderService) {
    this.carouselConfig.wrap = false;
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RECOMMENDATIONS.TITLE');
      this.subTitle = this.translate.instant('RECOMMENDATIONS.DESCRIPTION');
      this.setPageTitle(this.pageTitle, this.subTitle);
    });
  }

  ngOnInit() {
    this.recommendationPlans = this.getRecommendations();

    this.activeRecommendationType = this.recommendationPlans[0].type;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  setPageTitle(title: string, subTitle: string) {
    this.headerService.setPageTitle(title, subTitle);
  }

  moveCarouselNext() {
    this.recommendationCarousel.next();
    const container = this.elRef.nativeElement.querySelector('#recType');
    const containerBound = container.getBoundingClientRect();
    const bound = container.querySelector('[data-type=\'' + this.activeRecommendationType + '\'').getBoundingClientRect();
    if (bound.right > containerBound.right) {
      this.widgetsContent.nativeElement.scrollTo(
        {
          left: (this.widgetsContent.nativeElement.scrollLeft + bound.width),
          behavior: 'smooth'
        });
    }
  }

  moveCarouselPrev() {
    this.recommendationCarousel.prev();
    const container = this.elRef.nativeElement.querySelector('#recType');
    const containerBound = container.getBoundingClientRect();
    const bound = container.querySelector('[data-type=\'' + this.activeRecommendationType + '\'').getBoundingClientRect();
    if (bound.left < containerBound.left) {
      this.widgetsContent.nativeElement.scrollTo(
        {
          left: (this.widgetsContent.nativeElement.scrollLeft - bound.width),
          behavior: 'smooth'
        });
    }
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

  viewDetails(plan) {
    console.log('viewing plan :' + plan);
  }

  selectPlan(data) {
    if (data.isSelected) {
      console.log('selected plan :' + data.plan);
      this.selectedPlans.push(data.plan);
    } else {
      console.log('de-selected plan :' + data.plan);
      this.selectedPlans.pop(data.plan);
    }
  }

  getRecommendations() {
    return [{
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
        "premiumDuration": "Throughout Policy Term",
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
        "premiumDuration": "5 Years",
        "medicalUnderwritingRequired": false
      }
      ]
    }, {
      "type": "Occupational Disability",
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
        "premiumDuration": "Throughout Policy Term",
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
        "premiumDuration": "5 Years",
        "medicalUnderwritingRequired": false
      }
      ]
    }, {
      "type": "Hospital Plan",
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
        "premiumDuration": "Throughout Policy Term",
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
        "premiumDuration": "5 Years",
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
        "premiumDuration": "Throughout Policy Term",
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
        "premiumDuration": "10 Years",
        "medicalUnderwritingRequired": true
      }
      ]
    },
    {
      "type": "Long&#x2011;Term Care",
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
        "premiumDuration": "Throughout Policy Term",
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
        "premiumDuration": "5 Years",
        "medicalUnderwritingRequired": false
      }
      ]
    }
    ];
  }
}
