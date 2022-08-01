import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCardModalComponent } from './recommended-card-modal.component';

describe('RecommendedCardModalComponent', () => {
  let component: RecommendedCardModalComponent;
  let fixture: ComponentFixture<RecommendedCardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedCardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
