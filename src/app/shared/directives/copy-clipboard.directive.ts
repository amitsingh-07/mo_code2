import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({ selector: '[copy-clipboard]' })
export class CopyClipboardDirective {

    @Input('copy-clipboard')
    public targetElm: HTMLElement;

    @Input('context')
    public context: string;

    @Output('copied')
    public copied: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private elementRef: ElementRef
    ) { }

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent): void {

        const htmlEle: HTMLElement = this.targetElm;
        const contentString: any = this.context;

        const data: any = htmlEle.innerHTML || contentString;

        event.preventDefault();
        if (!this.targetElm && !this.context) {
            return;
        }

        this.copyToClipboard(data);
    }

    copyToClipboard(data) {
        const range = document.createRange();
        range.selectNodeContents(document.body);
        document.getSelection().addRange(range);

        const listener = (e: ClipboardEvent) => {
            const clipboard = e.clipboardData || window['clipboardData'];
            clipboard.setData('text', data);
            e.preventDefault();
            this.copied.emit(data);
        };

        document.addEventListener('copy', listener, false);
        document.execCommand('copy');
        document.removeEventListener('copy', listener, false);

        document.getSelection().removeAllRanges();
    }
}
