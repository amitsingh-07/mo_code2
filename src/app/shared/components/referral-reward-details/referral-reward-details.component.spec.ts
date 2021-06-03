import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralRewardDetailsComponent } from './referral-reward-details.component';

describe('ReferralRewardDetailsComponent', () => {
  let component: ReferralRewardDetailsComponent;
  let fixture: ComponentFixture<ReferralRewardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralRewardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralRewardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
