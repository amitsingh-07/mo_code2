import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictAddPortfolioModalComponent } from './restirct-add-portfolio-modal.component';

describe('RestrictAddPortfolioModalComponent', () => {
  let component: EditInvestmentModalComponent;
  let fixture: ComponentFixture<EditInvestmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestrictAddPortfolioModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictAddPortfolioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
