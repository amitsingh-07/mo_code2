import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GuideMeService } from './../guide-me.service';
import { GetStartedFormComponent } from './get-started-form/get-started-form.component';
import { UserInfo } from './get-started-form/user-info';

describe('GetStartedFormComponent', () => {
  let component: GetStartedFormComponent;
  let fixture: ComponentFixture<GetStartedFormComponent>;
  let guideMeService: GuideMeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ GetStartedFormComponent],
      providers: [GuideMeService]
    })
    .compileComponents();

    guideMeService = TestBed.get(GuideMeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.userInfoForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.userInfoForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.userInfoForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('submitting a form emits user info', () => {
    expect(component.userInfoForm.valid).toBeFalsy();
    component.userInfoForm.controls['dob'].setValue('12/10/1996');
    expect(component.userInfoForm.valid).toBeTruthy();

    component.save(component.userInfoForm);
    const user: UserInfo = guideMeService.getUserInfo();
    // Now we can check to make sure the emitted value is correct
    const dobObj = JSON.parse(user.dob);
    expect(dobObj.year).toBe('1996');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('12');
  });

  // Next Button functionality
  it('testing the proceed button', async(() => {
    spyOn(component, 'goToNext');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));
});
