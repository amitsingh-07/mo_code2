import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SummaryModalComponent } from './summary-modal.component';

describe('SummaryModalComponent', () => {
  let component: SummaryModalComponent;
  let fixture: ComponentFixture<SummaryModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
