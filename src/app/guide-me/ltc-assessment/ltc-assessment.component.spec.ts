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

  /*
    Need to test for the following
    1. User can select the protection needs as required
    2. When the user clicks on the ""?"" against the header, it will display the description of the insurance type
    3. User can view a list of long term care standard in a tile format.
    4. User can select a long term care standard by clicking on the respective type.
  */
});
