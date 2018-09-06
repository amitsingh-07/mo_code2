import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioRecommendationComponent } from './portfolio-recommendation.component';

describe('PortfolioRecommendationComponent', () => {
  let component: PortfolioRecommendationComponent;
  let fixture: ComponentFixture<PortfolioRecommendationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioRecommendationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
