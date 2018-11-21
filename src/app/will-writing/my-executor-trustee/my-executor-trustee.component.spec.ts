import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExecutorTrusteeComponent } from './my-executor-trustee.component';

describe('MyExecutorTrusteeComponent', () => {
  let component: MyExecutorTrusteeComponent;
  let fixture: ComponentFixture<MyExecutorTrusteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExecutorTrusteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExecutorTrusteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.addExeTrusteeForm.valid).toBeFalsy();
  });

  it('full name validity', () => {
    let errors = {};
    const name = component.addExeTrusteeForm.controls['name'];
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
    const uin = component.addExeTrusteeForm.controls['uin'];
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
    const relationship = component.addExeTrusteeForm.controls['relationship'];
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
