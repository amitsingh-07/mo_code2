import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeStepOneComponent } from './welcome-step-one.component';

describe('WelcomeStepOneComponent', () => {
  let component: WelcomeStepOneComponent;
  let fixture: ComponentFixture<WelcomeStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
