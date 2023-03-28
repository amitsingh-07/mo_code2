import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReferralRewardDetailsComponent } from './referral-reward-details.component';

describe('ReferralRewardDetailsComponent', () => {
  let component: ReferralRewardDetailsComponent;
  let fixture: ComponentFixture<ReferralRewardDetailsComponent>;

  beforeEach(waitForAsync(() => {
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
