import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkaAssessmentComponent } from './cka-assessment.component';

describe('CkaAssessmentComponent', () => {
  let component: CkaAssessmentComponent;
  let fixture: ComponentFixture<CkaAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkaAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkaAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
