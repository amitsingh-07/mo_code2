import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IncomeComponent } from './income.component';

describe('IncomeComponent', () => {
  let component: IncomeComponent;
  let fixture: ComponentFixture<IncomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let httpClientSpy: { get: jasmine.Spy };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, ReactiveFormsModule , NgbModule.forRoot()],
      declarations: [ IncomeComponent ],
      providers: [{ provide: Router, useValue: mockRouter }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    de = fixture.debugElement.query(By.css('button'));
    el = de.nativeElement;
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create Income component', () => {
    expect(component).toBeTruthy();
  });
  it('should be invalid if form is empty', () => {
    expect(component.incomeForm.valid).toBeFalsy();
  });

  it('validity of form monthly salary', () => {
    expect(component.incomeForm.valid).toBeFalsy();
    component.incomeForm.controls['monthlySalary'].setValue(1000);
    expect(component.incomeForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('validity of form annual bonus', () => {
    expect(component.incomeForm.valid).toBeFalsy();
    component.incomeForm.controls['annualBonus'].setValue(500);
    expect(component.incomeForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('validity of form other Income', () => {
    expect(component.incomeForm.valid).toBeFalsy();
    component.incomeForm.controls['otherIncome'].setValue(200);
    expect(component.incomeForm.valid).toBeTruthy();
  });

  it('testing the proceed button', async(() => {
    spyOn(component, 'goToNext');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));
});
