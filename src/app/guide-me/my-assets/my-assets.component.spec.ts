import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyAssetsComponent } from './my-assets.component';

describe('MyAssetsComponent', () => {
  let component: MyAssetsComponent;
  let fixture: ComponentFixture<MyAssetsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let httpClientSpy: { get: jasmine.Spy };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, ReactiveFormsModule , NgbModule.forRoot()],
      declarations: [ MyAssetsComponent ],
      providers: [{ provide: Router, useValue: mockRouter }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAssetsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    de = fixture.debugElement.query(By.css('button'));
    el = de.nativeElement;
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    fixture.detectChanges();
  });

  it('should create assets component', () => {
    expect(component).toBeTruthy();
  });
  it('should be invalid if form is empty', () => {
    expect(component.assetsForm.valid).toBeFalsy();
  });

  it('validity of form cash', () => {
    expect(component.assetsForm.valid).toBeFalsy();
    component.assetsForm.controls['cash'].setValue(1000);
    expect(component.assetsForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('validity of form cpf', () => {
    expect(component.assetsForm.valid).toBeFalsy();
    component.assetsForm.controls['cpf'].setValue(500);
    expect(component.assetsForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('validity of form homeProperty', () => {
    expect(component.assetsForm.valid).toBeFalsy();
    component.assetsForm.controls['homeProperty'].setValue(100);
    expect(component.assetsForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('validity of form investmentProperties', () => {
    expect(component.assetsForm.valid).toBeFalsy();
    component.assetsForm.controls['investmentProperties'].setValue(700);
    expect(component.assetsForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('validity of form otherInvestments', () => {
    expect(component.assetsForm.valid).toBeFalsy();
    component.assetsForm.controls['otherInvestments'].setValue(500);
    expect(component.assetsForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('validity of form otherAssets', () => {
    expect(component.assetsForm.valid).toBeFalsy();
    component.assetsForm.controls['otherAssets'].setValue(100);
    expect(component.assetsForm.valid).toBeTruthy();
  });

  // tslint:disable-next-line:no-identical-functions
  it('testing the proceed button', async(() => {
    spyOn(component, 'goToNext');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));

});
