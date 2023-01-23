import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPortfolioGoalMoreinfoComponent } from './select-portfolio-goal-moreinfo.component';

describe('SelectPortfolioGoalMoreinfoComponent', () => {
  let component: SelectPortfolioGoalMoreinfoComponent;
  let fixture: ComponentFixture<SelectPortfolioGoalMoreinfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectPortfolioGoalMoreinfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPortfolioGoalMoreinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
