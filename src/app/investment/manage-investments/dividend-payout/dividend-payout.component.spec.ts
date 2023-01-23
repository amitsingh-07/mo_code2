import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendPayoutComponent } from './dividend-payout.component';

describe('DividendPayoutComponent', () => {
  let component: DividendPayoutComponent;
  let fixture: ComponentFixture<DividendPayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DividendPayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividendPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
