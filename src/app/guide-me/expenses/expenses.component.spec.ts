import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesComponent } from './expenses.component';

describe('ExpensesComponent', () => {
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let httpClientSpy: { get: jasmine.Spy };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, ReactiveFormsModule , NgbModule.forRoot()],
      declarations: [ ExpensesComponent ],
      providers: [{ provide: Router, useValue: mockRouter }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    de = fixture.debugElement.query(By.css('button'));
    el = de.nativeElement;
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    fixture.detectChanges();
  });

  it('should create Expenses component', () => {
    expect(component).toBeTruthy();
  });
  it('should be invalid if form is empty', () => {
    expect(component.expensesForm.valid).toBeFalsy();
  });

  it('validity of form monthly expenses', () => {
    expect(component.expensesForm.valid).toBeFalsy();
    component.expensesForm.controls['monthlyInstallments'].setValue(1000);
    expect(component.expensesForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('validity of form other expenses', () => {
    expect(component.expensesForm.valid).toBeFalsy();
    component.expensesForm.controls['otherExpenses'].setValue(500);
    expect(component.expensesForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('invalidity of form monthly expenses', () => {
    expect(component.expensesForm.valid).toBeFalsy();
    component.expensesForm.controls['monthlyInstallments'].setValue('expenses');
    expect(component.expensesForm.valid).toBeFalsy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('invalidity of form other expenses', () => {
    expect(component.expensesForm.valid).toBeFalsy();
    component.expensesForm.controls['otherExpenses'].setValue('expenses');
    expect(component.expensesForm.valid).toBeFalsy();
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
