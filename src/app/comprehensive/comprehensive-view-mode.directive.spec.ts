import { ComprehensiveViewModeDirective } from './comprehensive-view-mode.directive';
import { TestBed } from '@angular/core/testing';
import { ElementRef, Injectable } from '@angular/core';

export class MockElementRef extends ElementRef {
  nativeElement = {};
}


describe('ComprehensiveViewModeDirective', () => {
  let comprehensiveViewModeDirective: ComprehensiveViewModeDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
  });
  let el = TestBed.get(ElementRef);

  it('should create an instance', () => {
    const directive = new ComprehensiveViewModeDirective(el);
    expect(directive).toBeTruthy();
  });
});
