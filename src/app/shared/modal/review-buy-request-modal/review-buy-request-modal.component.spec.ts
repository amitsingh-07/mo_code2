import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewBuyRequestModalComponent } from './review-buy-request-modal.component';

describe('ReviewBuyRequestModalComponent', () => {
  let component: ReviewBuyRequestModalComponent;
  let fixture: ComponentFixture<ReviewBuyRequestModalComponent>;

  beforeEach(async(() => {
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
