import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectService } from './../../direct.service';
import { EducationFormComponent } from './education-form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IEducation } from './education.interface';

describe('EducationFormComponent', () => {
  let component: EducationFormComponent;
  let fixture: ComponentFixture<EducationFormComponent>;
  let directService: DirectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ EducationFormComponent],
      providers: [DirectService]
    })
    .compileComponents();

    directService = TestBed.get(DirectService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.educationForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.educationForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.educationForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.educationForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.educationForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('submitting a form emits user info', () => {
    expect(component.educationForm.valid).toBeFalsy();
    component.educationForm.controls['dob'].setValue('04/10/1993');
    expect(component.educationForm.valid).toBeTruthy();

    component.save();
    const educationPlan: IEducation = directService.getEducationForm();
    const dobObj = JSON.parse(educationPlan.childdob);
    expect(dobObj.year).toBe('1993');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('04');
  });
  it('testing the Monthly contribution dropdown', async(() => {
    spyOn(component, 'monthlyContribution');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#coverageAmtDropDown button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.monthlyContribution).toHaveBeenCalled();
      });
    });
  }));
  it('testing the University Age dropdown', async(() => {
    spyOn(component, 'univercityEntryAge');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#coverageAmtDropDown button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.univercityEntryAge).toHaveBeenCalled();
      });
    });
  }));
});
