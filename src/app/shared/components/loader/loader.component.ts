import {
  AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild
} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnChanges {

  @Input() isVisible;
  @Input() content;
  @ViewChild('anim') anim: ElementRef;
  interval;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.animate();
    } else {
      clearInterval(this.interval);
    }
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
