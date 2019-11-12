import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensiveStepsComponent } from './comprehensive-steps.component';

describe('ComprehensiveStepsComponent', () => {
  let component: ComprehensiveStepsComponent;
  let fixture: ComponentFixture<ComprehensiveStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprehensiveStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprehensiveStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
