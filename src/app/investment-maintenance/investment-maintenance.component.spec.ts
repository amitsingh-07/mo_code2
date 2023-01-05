import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvestmentMaintenanceComponent } from './investment-maintenance.component';

describe('InvestmentMaintenanceComponent', () => {
  let component: InvestmentMaintenanceComponent;
  let fixture: ComponentFixture<InvestmentMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
