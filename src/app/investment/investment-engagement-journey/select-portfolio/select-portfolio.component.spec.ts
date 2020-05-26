import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPortfolioComponent } from './select-portfolio.component';

describe('SelectPortfolioComponent', () => {
  let component: SelectPortfolioComponent;
  let fixture: ComponentFixture<SelectPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
