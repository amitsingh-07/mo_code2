import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependantEducationSelectionComponent } from './dependant-education-selection.component';

describe('DependantEducationSelectionComponent', () => {
  let component: DependantEducationSelectionComponent;
  let fixture: ComponentFixture<DependantEducationSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependantEducationSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependantEducationSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
