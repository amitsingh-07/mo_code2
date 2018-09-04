import { Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[appNumberOnly]'
})

export class NumberOnlyDirective {
    constructor(private el: ElementRef) {
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        const initalValue = this.el.nativeElement.value;
        this.el.nativeElement.value = initalValue.replace(/[^0-9]/g, '');
        if (initalValue !== this.el.nativeElement.value) {
            event.stopPropagation();
        }
    }
}
