import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewYourDetailsComponent } from './review-your-details.component';

describe('ReviewYourDetailsComponent', () => {
  let component: ReviewYourDetailsComponent;
  let fixture: ComponentFixture<ReviewYourDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewYourDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewYourDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
