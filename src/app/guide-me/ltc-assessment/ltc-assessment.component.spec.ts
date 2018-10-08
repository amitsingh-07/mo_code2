import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LtcAssessmentComponent } from './ltc-assessment.component';

describe('LtcAssessmentComponent', () => {

  let component: LtcAssessmentComponent;
  let fixture: ComponentFixture<LtcAssessmentComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LtcAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(LtcAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing the Title
  it('should render Long Term Care title in a h2', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Long Term Care');
  }));

  // Testing the Description
  it('should render Long Term Care description in a h6', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('h6').textContent).toContain(`If one is unable to perform at least 3 of these activities
    (washing, feeding, dressing, toileting, mobility and transferring), he or she is considered severely disabled and would need
     Long-Term Care with the help of a caregiver. Select the type of caregiver that you prefer.`);
  }));

  // Testing the Mobile Pop-up Button
  it('testing the mobile pop-up button', async(() => {
    spyOn(component, 'showMobilePopUp');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.showMobilePopUp).toHaveBeenCalled();
    });
  }));

  // Testing the Proceed Button Created
  it('testing the proceed button', async(() => {
    spyOn(component, 'goToNext');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));
});
