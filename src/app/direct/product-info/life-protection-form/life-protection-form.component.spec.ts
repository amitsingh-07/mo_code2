
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectService } from './../../direct.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LifeProtectionFormComponent } from './life-protection-form.component';
import { ILifeProtection } from './life-protection.interface';

describe('LifeProtectionFormComponent', () => {
  let component: LifeProtectionFormComponent;
  let fixture: ComponentFixture<LifeProtectionFormComponent>;
  let directService: DirectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ LifeProtectionFormComponent],
      providers: [DirectService]
    })
    .compileComponents();

    directService = TestBed.get(DirectService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeProtectionFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.lifeProtectionForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.lifeProtectionForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.lifeProtectionForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.lifeProtectionForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.lifeProtectionForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('validity of form ', () => {
    expect(component.lifeProtectionForm.valid).toBeFalsy();
    component.lifeProtectionForm.controls['gender'].setValue('Smoker');
    expect(component.lifeProtectionForm.valid).toBeTruthy();
  });

  it('submitting a form emits user info', () => {
    expect(component.lifeProtectionForm.valid).toBeFalsy();
    component.lifeProtectionForm.controls['dob'].setValue('04/10/1993');
    expect(component.lifeProtectionForm.valid).toBeTruthy();

    component.save();
    const criticalPlan: ILifeProtection = directService.getLifeProtectionForm();
    const dobObj = JSON.parse(criticalPlan.dob);
    expect(dobObj.year).toBe('1993');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('04');
  });
  it('testing the Coverage Amount dropdown', async(() => {
    spyOn(component, 'coverage_amt');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#getStrLbl6 button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.coverage_amt).toHaveBeenCalled();
      });
    });
  }));
  it('testing the duration dropdown', async(() => {
    spyOn(component, 'duration');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#getStrLbl7 button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.duration).toHaveBeenCalled();
      });
    });
  }));
  it('Premium Waiver radio button field validity', () => {
    const radio = component.lifeProtectionForm.controls['premiumWaiver'];
    expect(radio.valid).toBeFalsy();
  });
  it('Premium Waiver radio button field validity', () => {
    const radio = component.lifeProtectionForm.controls['premiumWaiver'];
    expect(radio.valid).toBeFalsy();
  });
  // tslint:disable-next-line:no-identical-functions
  it('Premium Waiver validity of form ', () => {
    expect(component.lifeProtectionForm.valid).toBeFalsy();
    component.lifeProtectionForm.controls['premiumWaiver'].setValue('Yes');
    expect(component.lifeProtectionForm.valid).toBeTruthy();
  });
});
