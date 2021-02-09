import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiseIncomePayoutComponent } from './wise-income-payout.component';

describe('WiseIncomePayoutComponent', () => {
  let component: WiseIncomePayoutComponent;
  let fixture: ComponentFixture<WiseIncomePayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiseIncomePayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiseIncomePayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
