import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from './profile';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let httpClientSpy: { get: jasmine.Spy };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, ReactiveFormsModule , NgbModule.forRoot()],
      declarations: [ ProfileComponent ],
      providers: [ Profile,
        { provide: Router, useValue: mockRouter }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    de = fixture.debugElement.query(By.css('button'));
    el = de.nativeElement;
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    fixture.detectChanges();
  });

  it('should create profile component', () => {
    expect(component).toBeTruthy();
  });
  it('should be invalid if form is empty', () => {
    expect(component.profileForm.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.profileForm.controls['myProfile'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.profileForm.controls['myProfile'];
    expect(radio.valid).toBeFalsy();
  });
  it('validity of form ', () => {
    expect(component.profileForm.valid).toBeFalsy();
    component.profileForm.controls['myProfile'].setValue('Im a parent');
    expect(component.profileForm.valid).toBeTruthy();
  });
  it('disable the continue button', () => {
    fixture.detectChanges();
    expect(de.nativeElement.disabled).toBeTruthy();
  });
  it(' Enabled  the continue button', () => {
    // tslint:disable-next-line:quotemark
    component.profileForm.controls['myProfile'].setValue("I'm a parent");
    fixture.detectChanges();
    expect(de.nativeElement.disabled).toBeFalsy();
  });

});
