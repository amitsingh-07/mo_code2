import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecommendationsModalComponent } from './recommendations-modal.component';

describe('RecommendationsModalComponent', () => {
  let component: RecommendationsModalComponent;
  let fixture: ComponentFixture<RecommendationsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendationsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
