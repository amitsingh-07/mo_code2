import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictAddPortfolioModalComponent } from './restrict-add-portfolio-modal.component';

describe('RestrictAddPortfolioModalComponent', () => {
  let component: RestrictAddPortfolioModalComponent;
  let fixture: ComponentFixture<RestrictAddPortfolioModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestrictAddPortfolioModalComponent]
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
