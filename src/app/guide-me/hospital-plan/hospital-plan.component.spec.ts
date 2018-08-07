import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '../../../../node_modules/@angular/core';
import { By } from '../../../../node_modules/@angular/platform-browser';
import { HospitalPlanComponent } from './hospital-plan.component';

describe('HospitalPlanComponent', () => {
  let component: HospitalPlanComponent;
  let fixture: ComponentFixture<HospitalPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Testing the Title
  it('should render Long Term Care title in a h2', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Hospitalization');
  }));

  // Testing the Description
  it('should render Hospital Plan description in a h6', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('h6').textContent).toContain(`Select the type of hospital plan that you prefer.`);
  }));

  // User can select a Hospital Plan by clicking on the respective type.
  it('should call radioTest on radio button change', () => {
    spyOn(component, 'radioTest').and.callThrough();
    const options: DebugElement[] = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    const secondOption: HTMLInputElement = options[1].nativeElement;
    secondOption.checked = true;
    expect(component.radioTest).toHaveBeenCalled();
  });

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
