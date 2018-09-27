import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrsApprovedPlansFormComponent } from './srs-approved-plans-form.component';

describe('SrsApprovedPlansFormComponent', () => {
  let component: SrsApprovedPlansFormComponent;
  let fixture: ComponentFixture<SrsApprovedPlansFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrsApprovedPlansFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrsApprovedPlansFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
