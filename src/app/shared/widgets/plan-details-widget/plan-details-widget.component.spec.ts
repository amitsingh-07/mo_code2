import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailsWidgetComponent } from './plan-details-widget.component';

describe('PlanDetailsWidgetComponent', () => {
  let component: PlanDetailsWidgetComponent;
  let fixture: ComponentFixture<PlanDetailsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlanDetailsWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDetailsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
