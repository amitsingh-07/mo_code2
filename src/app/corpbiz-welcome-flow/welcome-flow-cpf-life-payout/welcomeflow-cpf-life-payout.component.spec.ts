import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeflowCpfLifePayoutComponent } from './welcomeflow-cpf-life-payout.component';

describe('WelcomeflowCpfLifePayoutComponent', () => {
  let component: WelcomeflowCpfLifePayoutComponent;
  let fixture: ComponentFixture<WelcomeflowCpfLifePayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeflowCpfLifePayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeflowCpfLifePayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
