import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appInputFocus]',
    providers: []
})

export class InputFocusDirective implements AfterViewInit {
    constructor(
        private el: ElementRef) {
    }

    ngAfterViewInit() {
    }

    @HostListener('focus', ['$event'])
    onFocus() {
        this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
