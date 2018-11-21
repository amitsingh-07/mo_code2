import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFamilyComponent } from './my-family.component';

describe('MyFamilyComponent', () => {
  let component: MyFamilyComponent;
  let fixture: ComponentFixture<MyFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.myFamilyForm.valid).toBeFalsy();
  });

  it('full name validity', () => {
    let errors = {};
    const name = component.myFamilyForm.controls['name'];
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
    const uin = component.myFamilyForm.controls['uin'];
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
    const relationship = component.myFamilyForm.controls['relationship'];
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
