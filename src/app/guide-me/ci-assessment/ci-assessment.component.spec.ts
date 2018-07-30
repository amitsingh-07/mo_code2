import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiAssessmentComponent } from './ci-assessment.component';

describe('CiAssessmentComponent', () => {
  let component: CiAssessmentComponent;
  let fixture: ComponentFixture<CiAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CiAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
