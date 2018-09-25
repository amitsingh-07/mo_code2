import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectService } from './../../direct.service';
import { RetirementIncomeFormComponent } from './retirement-income-form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IRetirementIncome } from './retirement-income.interface';

describe('RetirementIncomeFormComponent', () => {
  let component: RetirementIncomeFormComponent;
  let fixture: ComponentFixture<RetirementIncomeFormComponent>;
  let directService: DirectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ RetirementIncomeFormComponent],
      providers: [DirectService]
    })
    .compileComponents();

    directService = TestBed.get(DirectService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementIncomeFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.retirementIncomeForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.retirementIncomeForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.retirementIncomeForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.retirementIncomeForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.retirementIncomeForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('validity of form ', () => {
    expect(component.retirementIncomeForm.valid).toBeFalsy();
    component.retirementIncomeForm.controls['gender'].setValue('Smoker');
    expect(component.retirementIncomeForm.valid).toBeTruthy();
  });

  it('submitting a form emits user info', () => {
    expect(component.retirementIncomeForm.valid).toBeFalsy();
    component.retirementIncomeForm.controls['dob'].setValue('04/10/1993');
    expect(component.retirementIncomeForm.valid).toBeTruthy();

    component.save();
    const retirementPlan: IRetirementIncome = directService.getRetirementIncomeForm();
    const dobObj = JSON.parse(retirementPlan.dob);
    expect(dobObj.year).toBe('1993');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('04');
  });
  it('testing the retirement income dropdown', async(() => {
    spyOn(component, 'selectedRetirementIncome');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#dropdownBasic1 button');
    // tslint:disable-next-line:no-duplicate-string
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.selectedRetirementIncome).toHaveBeenCalled();
      });
    });
  }));
  it('testing the Payout Start Age dropdown', async(() => {
    spyOn(component, 'payoutDuration');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#getStrLbl7 button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.payoutDuration).toHaveBeenCalled();
      });
    });
  }));
  it('testing the Payout duration dropdown', async(() => {
    spyOn(component, 'selectedPayoutAge');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#dropdownDuration button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.selectedPayoutAge).toHaveBeenCalled();
      });
    });
  }));
  it('testing the Payout feature dropdown', async(() => {
    spyOn(component, 'payoutFeature');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#dropdownDuration button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.payoutFeature).toHaveBeenCalled();
      });
    });
  }));
});
