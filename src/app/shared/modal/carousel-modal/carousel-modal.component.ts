import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SlickComponent } from 'ngx-slick';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-carousel-modal',
  templateUrl: './carousel-modal.component.html',
  styleUrls: ['./carousel-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselModalComponent implements OnInit {
  @Input() slides: [JSON];
  @Input() startBtnTxt: string;
  @Input() endBtnTxt: string;

  // Set Input Styling for different elements, if not set will default to below styling
  @Input() imgClass = 'srs-img';
  @Input() imgTitleClass = 'srs-img-title';
  @Input() textStyle = {};
  @Input() btnDivStyle = {};
  @Output() closeAction = new EventEmitter<any>();

  @ViewChild('carousel') carousel: SlickComponent;
  public imgUrl = '../assets/images/';

  public currentSlide = 0;
  // Set config for ng slick
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '',
    prevArrow: '',
    dots: true,
    infinite: false,
  };

  constructor(public activeModal: NgbActiveModal, private router: Router) {
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // dismiss all bootstrap modal dialog
        this.activeModal.dismiss();
      });
  }
  // Dismiss modal
  closePopup(dismiss) {
    if (dismiss) {
      this.closeAction.emit();
    }
    this.activeModal.dismiss();
  }
  // Go to next slide
  nextSlide() {
    this.carousel.slickNext();
  }
  // Go back previous slide
  prevSlide() {
    this.carousel.slickPrev();
  }
  // Go to specific slide
  goToSlide(slide) {
    this.carousel.slickGoTo(slide);
  }
  // Setting the next slide index on beforeChange event fire
  beforeSlideChange(e) {
    this.currentSlide = e.nextSlide;
  }

}
