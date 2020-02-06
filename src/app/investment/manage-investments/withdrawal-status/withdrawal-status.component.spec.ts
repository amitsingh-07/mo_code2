import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalStatusComponent } from './withdrawal-status.component';

describe('WithdrawalStatusComponent', () => {
  let component: WithdrawalStatusComponent;
  let fixture: ComponentFixture<WithdrawalStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawalStatusComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
