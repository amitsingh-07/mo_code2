import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementNeedsComponent } from "./retirement-needs.component";

describe('RetirementNeedsComponent', () => {
  let component: RetirementNeedsComponent;
  let fixture: ComponentFixture<RetirementNeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementNeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
