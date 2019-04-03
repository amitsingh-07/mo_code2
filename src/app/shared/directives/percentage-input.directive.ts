import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
    selector: '[appPercentageInput]',
    providers: [CurrencyPipe, DecimalPipe]
})

export class PercentageInputDirective implements AfterViewInit {
    @Input() maxLength;
    [x: string]: any;

    constructor(
        private el: ElementRef, private currencyPipe: CurrencyPipe,
        private control: NgControl,
        private decimalPipe: DecimalPipe) {
            this.el.nativeElement.type = 'tel';
    }
    ngAfterViewInit() {
        this.formatCurrency();
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9]/g, '');
        if (this.el.nativeElement.value > 100) {
            this.el.nativeElement.value = 0;
            this.control.control.setValue(0);
        }
    }

    @HostListener('focus', ['$event'])
    onFocus() {
        this.el.nativeElement.value =
            (this.el.nativeElement.value === 0 || this.el.nativeElement.value === '0')
                ? '' : this.el.nativeElement.value;
        const currentElement = this.el.nativeElement.value;
        const Regexp = new RegExp('[' + this.currencySymbol + ',]', 'g');
        this.el.nativeElement.value = (currentElement).replace(Regexp, '');
        this.control.control.setValue((currentElement).replace(Regexp, ''));
    }

    @HostListener('blur', ['$event'])
    onblur() {
        this.formatCurrency();
    }

    formatCurrency() {
        let currentElement = this.el.nativeElement.value;
        currentElement = currentElement.replace(new RegExp('[,]', 'g'), '');
        if (!isNaN(currentElement) && currentElement != null && currentElement !== '') {
            const Regexp = new RegExp('[' + this.currencySymbol + ',]', 'g');
            currentElement = this.decimalPipe.transform((currentElement).replace(Regexp, ''));
            this.el.nativeElement.value = currentElement === '' ? 0 : currentElement;
        } else {
            this.el.nativeElement.value = 0;
            this.control.control.setValue(0);
        }
    }
}
