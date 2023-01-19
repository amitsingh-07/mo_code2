import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPortfolioTypeComponent } from './select-portfolio-type.component';

describe('SelectPortfolioTypeComponent', () => {
  let component: SelectPortfolioTypeComponent;
  let fixture: ComponentFixture<SelectPortfolioTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectPortfolioTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPortfolioTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
