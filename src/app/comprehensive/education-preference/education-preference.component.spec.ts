import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationPreferenceComponent } from './education-preference.component';

describe('EducationPreferenceComponent', () => {
  let component: EducationPreferenceComponent;
  let fixture: ComponentFixture<EducationPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
