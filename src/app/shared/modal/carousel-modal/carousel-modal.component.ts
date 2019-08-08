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

  slides = [
    {title: 'New Updates', titleImg: 'speaker.svg', img: 'srs.svg',
    imgTitle: 'Start Investing Your SRS!',
    text: 'Invest your Supplementary Retirement Scheme (SRS) to get potentially higher returns while enjoying tax savings.',
    url: 'https://www.google.com.sg', urlTxt: 'Learn More About SRS Account'},
    {title: 'New Updates',  titleImg: 'speaker.svg', img: 'joint-account.svg',
    imgTitle: 'Apply for a Joint Account',
    text: 'Apply for a Joint Investment Account with your loved ones today and enjoy all the good things that come in pairs.',
    url: 'https://www.google.com.sg', urlTxt: 'Learn More About Joint Account'},
    {title: 'Apply Now!', text: 'Please note that SRS and Joint Investment Accounts are currently handled offline.',
    contact: 'Contact us to apply:', tel: '(65)6329 9188', email: 'enquiries@moneyowl.com.sg'}
  ];

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
  // Open external url links and dismiss modal
  externalLink(url) {
    window.open(url, '_blank');
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

}
