import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalTypeComponent } from './withdrawal-type.component';

describe('WithdrawalTypeComponent', () => {
  let component: WithdrawalTypeComponent;
  let fixture: ComponentFixture<WithdrawalTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
