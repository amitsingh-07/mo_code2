import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appCurrencyInputPortfolio]',
    providers: [CurrencyPipe, DecimalPipe]
})

export class CurrencyInputPortfolioDirective implements AfterViewInit {
    @Input() maxLength;
    [x: string]: any;

    constructor(
        private el: ElementRef, private currencyPipe: CurrencyPipe,
        private control: NgControl,
        private decimalPipe: DecimalPipe) {
            this.el.nativeElement.type = 'tel'; // workaround for predictive text keyboard issue in samsung devices
            this.el.nativeElement.setAttribute('inputmode', 'decimal');
    }
    ngAfterViewInit() {
        this.formatCurrency();
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.keyCode !== 37 && event.keyCode !== 39 && event.keyCode !== 8 && (event.keyCode < 48 || event.keyCode > 57)) {
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9]/g, '');
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
