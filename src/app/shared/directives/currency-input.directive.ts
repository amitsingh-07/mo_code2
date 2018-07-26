import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[currencyInput]',
  providers: [CurrencyPipe,DecimalPipe]
})

export class CurrencyInputDirective {
    @Input() maxLength;
    [x: string]: any;

    constructor(private el: ElementRef, private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe) {
    
  }
@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
        let e = <KeyboardEvent> event;
        if(this.el.nativeElement.value.length < this.maxLength)
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9]/g, '');
        else if(this.el.nativeElement.value.length > this.maxLength && e.keyCode!=8 && e.keyCode!=37 && e.keyCode!=39 && e.keyCode!=9){

            if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) ){
                e.preventDefault()
            }
            else  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
        
    }
@HostListener('focus', ['$event'])
    onFocus() {
        this.el.nativeElement.value = this.el.nativeElement.value == 0 ? "" : this.el.nativeElement.value
        let currentElement = this.el.nativeElement.value;
        let Regexp = new RegExp("[" + this.currencySymbol + ",]", "g");
        this.el.nativeElement.value =(currentElement).replace(Regexp, "");
    }
@HostListener('blur', ['$event'])
    onblur() {
        let currentElement = this.el.nativeElement.value;
        if(!isNaN(currentElement) && currentElement!=null && currentElement!=""){
            let Regexp = new RegExp("[" + this.currencySymbol + ",]", "g");
            currentElement = this.decimalPipe.transform((currentElement).replace(Regexp, ""));
            this.el.nativeElement.value =  currentElement == ""  ? 0 : currentElement
        }else{
            this.el.nativeElement.value = 0
        }
        
      
    } 

}