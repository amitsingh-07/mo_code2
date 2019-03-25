import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependantEducationComponent } from './dependant-education.component';

describe('DependantEducationComponent', () => {
  let component: DependantEducationComponent;
  let fixture: ComponentFixture<DependantEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependantEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependantEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
