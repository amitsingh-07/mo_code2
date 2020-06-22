
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[capsLock]' })
export class CapsLockInputDirective {
  @Output('capsLock') capsLock = new EventEmitter<Boolean>();
  
  @HostListener('window:click', ['$event']) onClick(event){
    this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
    }
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
  }
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
  }
  @HostListener('focus', ['$event'])
    onFocus(event: KeyboardEvent): void {
      this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
    }
    @HostListener("blur", ['$event'])
    onblur(event: KeyboardEvent): void {
      this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
    }
}


