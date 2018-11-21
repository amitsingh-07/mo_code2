import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IntroductionComponent } from './introduction.component';

describe('IntroductionComponent', () => {
  let component: IntroductionComponent;
  let fixture: ComponentFixture<IntroductionComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
  });

  it('should have the text contact', async () => {
    expect(component.pageTitle).toEqual('Introduction');
  });

  it('should be invalid', async () => {
    component.promoCodeForm.controls['promoCode'].setValue('');
    expect(component.promoCodeForm.valid).toBeFalsy();
  });

  it('should call save button', async () => {
    fixture.detectChanges();
    spyOn(component, 'save');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.save).toBeTruthy();
  });

  it('should be valid', async () => {
    component.promoCodeForm.controls['promoCode'].setValue('ABC123');
    expect(component.promoCodeForm.valid).toBeTruthy();
  });
});
