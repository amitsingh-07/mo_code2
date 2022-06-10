import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpfLifePayoutComponent } from './cpf-life-payout.component';

describe('WelcomeflowCpfLifePayoutComponent', () => {
  let component: CpfLifePayoutComponent;
  let fixture: ComponentFixture<CpfLifePayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpfLifePayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpfLifePayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
