import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependantEducationListComponent } from './dependant-education-list.component';

describe('DependantEducationListComponent', () => {
  let component: DependantEducationListComponent;
  let fixture: ComponentFixture<DependantEducationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependantEducationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependantEducationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
