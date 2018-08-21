import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanWidgetComponent } from './plan-widget.component';

describe('PlanWidgetComponent', () => {
  let component: PlanWidgetComponent;
  let fixture: ComponentFixture<PlanWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
