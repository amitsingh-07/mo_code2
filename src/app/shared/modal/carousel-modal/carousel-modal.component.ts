import { Component, Input, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { SlickComponent } from 'ngx-slick';

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
  @ViewChild('carousel') carousel: SlickComponent;
  public imgUrl = '../assets/images/srs-joint-account/';

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '',
    prevArrow: '',
    dots: false,
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
  closePopup() {
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

  goToFaqInvestment() {
    this.activeModal.dismiss();
    this.router.navigate(['faq'], {fragment: 'investment'});
  }

}
