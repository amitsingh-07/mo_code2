import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPlanningComponent } from './start-planning.component';

describe('StartPlanningComponent', () => {
  let component: StartPlanningComponent;
  let fixture: ComponentFixture<StartPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
