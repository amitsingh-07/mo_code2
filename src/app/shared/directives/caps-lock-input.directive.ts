
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[capsLock]' })
export class CapsLockInputDirective {
  @Output('capsLock') capsLock = new EventEmitter<Boolean>();
  
  @HostListener('window:click', ['$event'])
   onClick(event){
    const capsOn = event.getModifierState && event.getModifierState('CapsLock');
    this.capsLock.emit(capsOn);
    }
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const capsOn = event.getModifierState && event.getModifierState('CapsLock');
    this.capsLock.emit(capsOn);
  }
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const capsOn = event.getModifierState && event.getModifierState('CapsLock');
    this.capsLock.emit(capsOn);
  }
 
}


