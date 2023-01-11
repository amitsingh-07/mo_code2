import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewBuyRequestModalComponent } from './review-buy-request-modal.component';

describe('ReviewBuyRequestModalComponent', () => {
  let component: ReviewBuyRequestModalComponent;
  let fixture: ComponentFixture<ReviewBuyRequestModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewBuyRequestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewBuyRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
