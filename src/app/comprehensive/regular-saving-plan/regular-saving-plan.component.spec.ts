import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularSavingPlanComponent } from './regular-saving-plan.component';

describe('RegularSavingPlanComponent', () => {
  let component: RegularSavingPlanComponent;
  let fixture: ComponentFixture<RegularSavingPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularSavingPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularSavingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
