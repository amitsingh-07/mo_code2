import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectService } from './../../direct.service';
import { CriticalIllnessFormComponent } from './critical-illness-form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICriticalIllness } from './critical-illness.interface';

describe('CriticalIllnessFormComponent', () => {
  let component: CriticalIllnessFormComponent;
  let fixture: ComponentFixture<CriticalIllnessFormComponent>;
  let directService: DirectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ CriticalIllnessFormComponent],
      providers: [DirectService]
    })
    .compileComponents();

    directService = TestBed.get(DirectService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalIllnessFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.criticalIllnessForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.criticalIllnessForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.criticalIllnessForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.criticalIllnessForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.criticalIllnessForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('validity of form ', () => {
    expect(component.criticalIllnessForm.valid).toBeFalsy();
    component.criticalIllnessForm.controls['gender'].setValue('Smoker');
    expect(component.criticalIllnessForm.valid).toBeTruthy();
  });

  it('submitting a form emits user info', () => {
    expect(component.criticalIllnessForm.valid).toBeFalsy();
    component.criticalIllnessForm.controls['dob'].setValue('04/10/1993');
    expect(component.criticalIllnessForm.valid).toBeTruthy();

    component.save();
    const criticalPlan: ICriticalIllness = directService.getCriticalIllnessForm();
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
  it('Early CI radio button field validity', () => {
    const radio = component.criticalIllnessForm.controls['earlyCI'];
    expect(radio.valid).toBeFalsy();
  });
  it('Early CI radio button field validity', () => {
    const radio = component.criticalIllnessForm.controls['earlyCI'];
    expect(radio.valid).toBeFalsy();
  });
  // tslint:disable-next-line:no-identical-functions
  it('Early CI validity of form ', () => {
    expect(component.criticalIllnessForm.valid).toBeFalsy();
    component.criticalIllnessForm.controls['earlyCI'].setValue('Yes');
    expect(component.criticalIllnessForm.valid).toBeTruthy();
  });
});
