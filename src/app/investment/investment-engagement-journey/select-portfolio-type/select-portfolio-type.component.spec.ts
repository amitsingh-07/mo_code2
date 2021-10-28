import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPortfolioTypeComponent } from './select-portfolio-type.component';

describe('SelectPortfolioTypeComponent', () => {
  let component: SelectPortfolioTypeComponent;
  let fixture: ComponentFixture<SelectPortfolioTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPortfolioTypeComponent ]
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
