import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appComprehensiveViewMode]'
})
export class ComprehensiveViewModeDirective implements AfterViewInit  {
  @Input() appComprehensiveViewMode: string;
  @Input() mode: number;
  constructor(private el: ElementRef) { }
  ngAfterViewInit() {
    if (this.appComprehensiveViewMode === 'true') {
      // tslint:disable-next-line: triple-equals
      if  (this.mode == 1) {
        this.el.nativeElement.disabled = true;
      } else if (this.mode == 2) {
        this.el.nativeElement.hidden = true;
      }

    }
  }
}
