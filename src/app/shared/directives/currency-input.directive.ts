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
        if ((event.keyCode !== 37 && event.keyCode !== 39 && event.keyCode !== 8 && (event.keyCode < 48 || event.keyCode > 57)) || event.keyCode === undefined) {
            const regPattern = this.allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
            this.el.nativeElement.value = this.el.nativeElement.value.replace(regPattern, '');
            this.el.nativeElement.dispatchEvent(new Event('input'));
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
    }

    @HostListener('blur', ['$event'])
    onblur() {
        this.formatCurrency();
    }

    @HostListener('document:paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        const Regexp = new RegExp('[' + this.currencySymbol + ',]', 'g');
        const pastedAmount = event.clipboardData.getData('text').replace(Regexp, '');
        this.el.nativeElement.value = (pastedAmount) ? pastedAmount : 0;
        event.preventDefault();
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
