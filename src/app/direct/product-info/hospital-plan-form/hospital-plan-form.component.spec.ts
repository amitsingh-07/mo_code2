import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectService } from './../../direct.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HospitalPlanFormComponent } from './hospital-plan-form.component';
import { IHospital } from './hospital-plan.interface';

describe('HospitalPlanFormComponent', () => {
  let component: HospitalPlanFormComponent;
  let fixture: ComponentFixture<HospitalPlanFormComponent>;
  let directService: DirectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ HospitalPlanFormComponent],
      providers: [DirectService]
    })
    .compileComponents();

    directService = TestBed.get(DirectService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPlanFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.hospitalForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.hospitalForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.hospitalForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.hospitalForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.hospitalForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('validity of form ', () => {
    expect(component.hospitalForm.valid).toBeFalsy();
    component.hospitalForm.controls['gender'].setValue('Smoker');
    expect(component.hospitalForm.valid).toBeTruthy();
  });

  it('submitting a form emits user info', () => {
    expect(component.hospitalForm.valid).toBeFalsy();
    component.hospitalForm.controls['dob'].setValue('04/10/1993');
    expect(component.hospitalForm.valid).toBeTruthy();

    component.save();
    const hospitalPlan: IHospital = directService.getHospitalPlanForm();
    const dobObj = JSON.parse(hospitalPlan.dob);
    expect(dobObj.year).toBe('1993');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('04');
  });
  it('testing the Plan Type dropdown', async(() => {
    spyOn(component, 'planType');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#planTypeDropDown button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.planType).toHaveBeenCalled();
      });
    });
  }));
});
