import {
  AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild
} from '@angular/core';

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
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.loaderParamChange.subscribe((param) => {
      if (param) {
        this.params = param;
        this.showLoader();
      } else {
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
      if (this.anim.nativeElement.innerHTML.length < 3) {
        this.anim.nativeElement.innerHTML += '.';
      } else {
        this.anim.nativeElement.innerHTML = '';
      }
    }, 500);
  }
}
