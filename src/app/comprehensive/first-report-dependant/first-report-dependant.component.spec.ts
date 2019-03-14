import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstReportDependantComponent } from './first-report-dependant.component';

describe('FirstReportDependantComponent', () => {
  let component: FirstReportDependantComponent;
  let fixture: ComponentFixture<FirstReportDependantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstReportDependantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstReportDependantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
