import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensiveReviewComponent } from './comprehensive-review.component';

describe('ComprehensiveReviewComponent', () => {
  let component: ComprehensiveReviewComponent;
  let fixture: ComponentFixture<ComprehensiveReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprehensiveReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprehensiveReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
