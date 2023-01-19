import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvestmentTitleBarComponent } from './investment-title-bar.component';

describe('InvestmentTitleBarComponent', () => {
  let component: InvestmentTitleBarComponent;
  let fixture: ComponentFixture<InvestmentTitleBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentTitleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentTitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
