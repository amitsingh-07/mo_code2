import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PortfolioInfoComponent } from './portfolio-info.component';

describe('PortfolioInfoComponent', () => {
  let component: PortfolioInfoComponent;
  let fixture: ComponentFixture<PortfolioInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
