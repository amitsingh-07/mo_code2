import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyBuyFromMoneyOwlComponent } from './why-buy-from-money-owl.component';

describe('WhyBuyFromMoneyOwlComponent', () => {
  let component: WhyBuyFromMoneyOwlComponent;
  let fixture: ComponentFixture<WhyBuyFromMoneyOwlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyBuyFromMoneyOwlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyBuyFromMoneyOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
