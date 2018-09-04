import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownAccordionComponent } from './breakdown-accordion.component';

describe('BreakdownAccordionComponent', () => {
  let component: BreakdownAccordionComponent;
  let fixture: ComponentFixture<BreakdownAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakdownAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakdownAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
