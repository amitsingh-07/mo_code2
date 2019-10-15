import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appCurrencyInput]',
    providers: [CurrencyPipe, DecimalPipe]
})

export class CurrencyInputDirective implements AfterViewInit {
    @Input() maxLength;
    @Input() decimalFormat;
    @Input() allowDecimal;
    [x: string]: any;

    constructor(
        private el: ElementRef, private currencyPipe: CurrencyPipe,
        private decimalPipe: DecimalPipe) {
            this.el.nativeElement.type = 'tel'; // workaround for predictive text keyboard issue in samsung devices
            this.el.nativeElement.setAttribute('inputmode', 'decimal');
    }
    ngAfterViewInit() {
        this.formatCurrency();
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        const regPattern = this.allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
        this.el.nativeElement.value = this.el.nativeElement.value.replace(regPattern, '');
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
            currentElement = this.decimalPipe.transform((currentElement).replace(Regexp, ''), this.decimalFormat);
            this.el.nativeElement.value = currentElement === '' ? 0 : currentElement;
        } else {
            this.el.nativeElement.value = 0;
        }
    }
}
