import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appCurrencyInputPortfolio]',
    providers: [CurrencyPipe, DecimalPipe]
})

export class CurrencyInputPortfolioDirective implements AfterViewInit {
    @Input() maxLength;
    [x: string]: any;

    constructor(
        private el: ElementRef, private currencyPipe: CurrencyPipe,
        private decimalPipe: DecimalPipe) {
    }
    ngAfterViewInit() {
        this.formatCurrency();
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9]/g, '');
    }

    @HostListener('focus', ['$event'])
    onFocus() {
        this.el.nativeElement.value =
            (this.el.nativeElement.value === 0 || this.el.nativeElement.value === '0')
                ? '' : this.el.nativeElement.value;
        const currentElement = this.el.nativeElement.value;
        const Regexp = new RegExp('[' + this.currencySymbol + ',]', 'g');
        this.el.nativeElement.value = (currentElement).replace(Regexp, '');
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
        }
    }
}
