import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectService } from './../../direct.service';
import { SrsApprovedPlansFormComponent } from './srs-approved-plans-form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ISrsApprovedPlans } from './srs-approved-plans-form.interface';

describe('srsApprovedPlansFormComponent', () => {
  let component: SrsApprovedPlansFormComponent;
  let fixture: ComponentFixture<SrsApprovedPlansFormComponent>;
  let directService: DirectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ SrsApprovedPlansFormComponent],
      providers: [DirectService]
    })
    .compileComponents();

    directService = TestBed.get(DirectService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrsApprovedPlansFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.srsApprovedPlansForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.srsApprovedPlansForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.srsApprovedPlansForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.srsApprovedPlansForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.srsApprovedPlansForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('submitting a form emits user info', () => {
    expect(component.srsApprovedPlansForm.valid).toBeFalsy();
    component.srsApprovedPlansForm.controls['dob'].setValue('04/10/1993');
    expect(component.srsApprovedPlansForm.valid).toBeTruthy();

    component.save();
    const srsApprovedPlans: ISrsApprovedPlans = directService.getSrsApprovedPlansForm();
    const dobObj = JSON.parse(srsApprovedPlans.dob);
    expect(dobObj.year).toBe('1993');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('04');
  });
  it('testing the payout Start Age dropdown', async(() => {
    spyOn(component, 'payoutStartAge');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#dropdownBasic1 button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.payoutStartAge).toHaveBeenCalled();
      });
    });
  }));
  it('testing the payout Type dropdown', async(() => {
    spyOn(component, 'payoutType');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#dropdownDuration button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.payoutType).toHaveBeenCalled();
      });
    });
  }));
});
