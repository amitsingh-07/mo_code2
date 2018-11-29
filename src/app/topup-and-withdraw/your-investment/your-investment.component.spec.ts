import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourInvestmentComponent } from './your-investment.component';

describe('YourInvestmentComponent', () => {
  let component: YourInvestmentComponent;
  let fixture: ComponentFixture<YourInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
