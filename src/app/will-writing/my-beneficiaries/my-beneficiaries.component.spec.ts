import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBeneficiariesComponent } from './my-beneficiaries.component';

describe('MyBeneficiariesComponent', () => {
  let component: MyBeneficiariesComponent;
  let fixture: ComponentFixture<MyBeneficiariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBeneficiariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.addBeneficiaryForm.valid).toBeFalsy();
  });

  it('full name validity', () => {
    let errors = {};
    const name = component.addBeneficiaryForm.controls['name'];
    expect(name.valid).toBeFalsy();

    // full name field is required
    errors = name.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for invalid  name
    name.setValue('12345845');
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for valid  name
    name.setValue('test');
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();

  });

  it('identification number validity', () => {
    let errors = {};
    const uin = component.addBeneficiaryForm.controls['uin'];
    expect(uin.valid).toBeFalsy();

    // uin field is required
    errors = uin.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for invalid uin
    uin.setValue('12345845');
    errors = uin.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for invalid uin
    uin.setValue('asdfd');
    errors = uin.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for valid uin
    uin.setValue('asdfghjk9');
    errors = uin.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('relationship to you validity', () => {
    let errors = {};
    const relationship = component.addBeneficiaryForm.controls['relationship'];
    expect(relationship.valid).toBeFalsy();

    // relationship field is required
    errors = relationship.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for invalid relationship
    relationship.setValue('');
    errors = relationship.errors || {};
    expect(errors['required']).toBeFalsy();

    // Check for valid uin
    relationship.setValue('spouse');
    errors = relationship.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
