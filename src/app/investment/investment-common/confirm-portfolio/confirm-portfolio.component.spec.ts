
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';


import { ConfirmPortfolioComponent } from './confirm-portfolio.component';

describe('ConfirmPortfolioComponent', () => {
  let component: ConfirmPortfolioComponent;
  let fixture: ComponentFixture<ConfirmPortfolioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPortfolioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
