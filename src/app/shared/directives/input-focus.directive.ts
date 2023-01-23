import { AfterViewInit, Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appInputFocus]',
    providers: []
})

export class InputFocusDirective implements AfterViewInit {
    constructor() {}

    ngAfterViewInit() {
    }

    @HostListener('focus', ['$event'])
    onFocus() {}
}
