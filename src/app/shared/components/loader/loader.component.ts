import {
  AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild
} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() isVisible;
  @Input() messageTitle;
  @Input() messageDesc;
  @ViewChild('anim') anim: ElementRef;
  interval;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.animate();
  }

  animate() {
    if (this.isVisible) {
      this.interval = setInterval(() => {
        if (this.anim.nativeElement.innerHTML.length < 3) {
          this.anim.nativeElement.innerHTML += '.';
        } else {
          this.anim.nativeElement.innerHTML = '';
        }
      }, 500);
    } else {
      clearInterval(this.interval);
    }
  }
}
