import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectService } from './../../direct.service';
import { OcpDisabilityFormComponent } from './ocp-disability-form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IOcpDisability } from './ocp-disability-form.interface';

describe('OcpDisabilityFormComponent', () => {
  let component: OcpDisabilityFormComponent;
  let fixture: ComponentFixture<OcpDisabilityFormComponent>;
  let directService: DirectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ OcpDisabilityFormComponent],
      providers: [DirectService]
    })
    .compileComponents();

    directService = TestBed.get(DirectService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcpDisabilityFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.ocpDisabilityForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.ocpDisabilityForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.ocpDisabilityForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.ocpDisabilityForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.ocpDisabilityForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('validity of form ', () => {
    expect(component.ocpDisabilityForm.valid).toBeFalsy();
    component.ocpDisabilityForm.controls['gender'].setValue('Smoker');
    expect(component.ocpDisabilityForm.valid).toBeTruthy();
  });

  it('submitting a form emits user info', () => {
    expect(component.ocpDisabilityForm.valid).toBeFalsy();
    component.ocpDisabilityForm.controls['dob'].setValue('04/10/1993');
    expect(component.ocpDisabilityForm.valid).toBeTruthy();

    component.save();
    const criticalPlan: IOcpDisability = directService.getOcpDisabilityForm();
    const dobObj = JSON.parse(criticalPlan.dob);
    expect(dobObj.year).toBe('1993');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('04');
  });
  it('testing the duration dropdown', async(() => {
    spyOn(component, 'duration');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#durationDropDown button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.duration).toHaveBeenCalled();
      });
    });
  }));
});
