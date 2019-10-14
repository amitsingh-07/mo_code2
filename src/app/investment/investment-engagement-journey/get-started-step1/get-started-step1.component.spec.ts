import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedStep1Component } from './get-started-step1.component';

describe('GetStartedStep1Component', () => {
  let component: GetStartedStep1Component;
  let fixture: ComponentFixture<GetStartedStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartedStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
