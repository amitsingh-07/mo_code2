import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProgressTrackerComponent } from './progress-tracker.component';

describe('ProgressTrackerComponent', () => {
  let component: ProgressTrackerComponent;
  let fixture: ComponentFixture<ProgressTrackerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
