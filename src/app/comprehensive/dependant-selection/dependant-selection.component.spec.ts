import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependantSelectionComponent } from './dependant-selection.component';

describe('DependantSelectionComponent', () => {
  let component: DependantSelectionComponent;
  let fixture: ComponentFixture<DependantSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependantSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependantSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
