import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LtcAssessmentComponent } from './ltc-assessment.component';

describe('LtcAssessmentComponent', () => {
  let component: LtcAssessmentComponent;
  let fixture: ComponentFixture<LtcAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LtcAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtcAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
