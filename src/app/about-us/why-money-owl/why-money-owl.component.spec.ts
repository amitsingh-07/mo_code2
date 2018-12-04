import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyMoneyOwlComponent } from './why-money-owl.component';

describe('WhyMoneyOwlComponent', () => {
  let component: WhyMoneyOwlComponent;
  let fixture: ComponentFixture<WhyMoneyOwlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyMoneyOwlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyMoneyOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
