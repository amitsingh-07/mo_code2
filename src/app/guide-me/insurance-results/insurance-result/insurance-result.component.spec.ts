import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceResultComponent } from './insurance-result.component';

describe('InsuranceResultComponent', () => {
  let component: InsuranceResultComponent;
  let fixture: ComponentFixture<InsuranceResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
