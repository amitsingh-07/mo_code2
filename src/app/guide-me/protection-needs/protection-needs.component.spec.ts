import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProtectionNeeds } from './protection-needs';
import { ProtectionNeedsComponent } from './protection-needs.component';

describe('ProtectionNeedsComponent', () => {
  let component: ProtectionNeedsComponent;
  let fixture: ComponentFixture<ProtectionNeedsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let httpClientSpy: { get: jasmine.Spy };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, ReactiveFormsModule , NgbModule.forRoot()],
      declarations: [ ProtectionNeedsComponent ],
      providers: [ ProtectionNeeds,
        { provide: Router, useValue: mockRouter }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectionNeedsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    de = fixture.debugElement.query(By.css('button'));
    el = de.nativeElement;
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    fixture.detectChanges();
  });

  it('should create protectionNeeds component', () => {
    expect(component).toBeTruthy();
  });
  it('should be invalid if form is empty', () => {
    expect(component.protectionNeedsForm.valid).toBeFalsy();
  });
  it('checkbox field validity', () => {
    const checkbox = component.protectionNeedsForm.controls['protectionNeedType'];
    expect(checkbox.valid).toBeFalsy();
  });
  it('checkbox field validity', () => {
    const radio = component.protectionNeedsForm.controls['protectionNeedType'];
    expect(radio.valid).toBeFalsy();
  });
  it('validity of form ', () => {
    expect(component.protectionNeedsForm.valid).toBeFalsy();
    component.protectionNeedsForm.controls['protectionNeedType'].setValue('Long-Term Care');
    expect(component.protectionNeedsForm.valid).toBeTruthy();
  });
  it('disable the continue button', () => {
    fixture.detectChanges();
    expect(de.nativeElement.disabled).toBeTruthy();
  });
  it(' Enabled  the continue button', () => {
    component.protectionNeedsForm.controls['protectionNeedType'].setValue('Long-Term Care');
    fixture.detectChanges();
    expect(de.nativeElement.disabled).toBeFalsy();
  });

});
