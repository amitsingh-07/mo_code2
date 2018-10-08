import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
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

  it('click on select plan', () => {
    spyOn(component, 'selectPlan');
    const selectPlanButton = fixture.debugElement.query(By.css('button'))[2];
    selectPlanButton.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(component.selectPlan).toHaveBeenCalled();
    });
  });

  it('click on compare ', () => {
    spyOn(component, 'compareplan');
    const compareplanButton = fixture.debugElement.query(By.css('button'))[1];
    compareplanButton.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(component.compareplan).toHaveBeenCalled();
    });
  });

  it('click on details ', () => {
    spyOn(component, 'viewDetails');
    const viewDetailsButton = fixture.debugElement.query(By.css('button'))[0];
    viewDetailsButton.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(component.viewDetails).toHaveBeenCalled();
    });
  });

});
