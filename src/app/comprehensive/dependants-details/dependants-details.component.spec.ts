import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependantsDetailsComponent } from './dependants-details.component';

describe('DependantsDetailsComponent', () => {
  let component: DependantsDetailsComponent;
  let fixture: ComponentFixture<DependantsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependantsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependantsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
