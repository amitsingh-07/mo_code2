import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCardComponent } from './recommended-card.component';

describe('RecommendedCardComponent', () => {
  let component: RecommendedCardComponent;
  let fixture: ComponentFixture<RecommendedCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
