import { Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { LoaderService } from './loader.service';

@Component({
  selector: 'app-common-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnChanges {

  isVisible = false;
  params;
  @ViewChild('anim') anim: ElementRef;
  interval;
  constructor(
    private loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loaderService.loaderParamChange.subscribe((param) => {
      if (param) {
        this.params = param;
        this.showLoader();
      } else {
        this.hideLoader();
      }
    });

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.hideLoader();
      }
    });
  }

  ngOnChanges() {
  }

  showLoader() {
    this.isVisible = true;
    this.animate();
  }

  hideLoader() {
    this.isVisible = false;
    clearInterval(this.interval);
  }

  animate() {
    this.interval = setInterval(() => {
      if (this.anim) {
        if (this.anim.nativeElement.innerHTML.length < 3) {
          this.anim.nativeElement.innerHTML += '.';
        } else {
          this.anim.nativeElement.innerHTML = '';
        }
      }
    }, 500);
  }
}
