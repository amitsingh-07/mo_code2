import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceResultsComponent } from './insurance-results.component';

describe('InsuranceResultsComponent', () => {
  let component: InsuranceResultsComponent;
  let fixture: ComponentFixture<InsuranceResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
