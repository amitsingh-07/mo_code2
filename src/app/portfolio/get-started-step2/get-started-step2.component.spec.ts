import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedStep2Component } from './get-started-step2.component';

describe('GetStartedStep2Component', () => {
  let component: GetStartedStep2Component;
  let fixture: ComponentFixture<GetStartedStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartedStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
