import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectService } from './../../direct.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LongTermCareFormComponent } from './long-term-care-form.component';
import { ILongTermCare } from './long-term-care.interface';

describe('LongTermCareFormComponent', () => {
  let component: LongTermCareFormComponent;
  let fixture: ComponentFixture<LongTermCareFormComponent>;
  let directService: DirectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ LongTermCareFormComponent],
      providers: [DirectService]
    })
    .compileComponents();

    directService = TestBed.get(DirectService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermCareFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.longTermCareForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.longTermCareForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.longTermCareForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.longTermCareForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.longTermCareForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('submitting a form emits user info', () => {
    expect(component.longTermCareForm.valid).toBeFalsy();
    component.longTermCareForm.controls['dob'].setValue('04/10/1993');
    expect(component.longTermCareForm.valid).toBeTruthy();

    component.save();
    const longTermPlan: ILongTermCare = directService.getLongTermCareForm();
    const dobObj = JSON.parse(longTermPlan.dob);
    expect(dobObj.year).toBe('1993');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('04');
  });
  it('testing the Monthly Payout dropdown', async(() => {
    spyOn(component, 'monthlyPayoutList');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#coverageAmtDropDown button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.monthlyPayoutList).toHaveBeenCalled();
      });
    });
  }));
});
