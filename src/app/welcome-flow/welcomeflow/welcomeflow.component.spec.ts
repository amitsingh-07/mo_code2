import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeflowComponent } from './welcomeflow.component';

describe('WelcomeflowComponent', () => {
  let component: WelcomeflowComponent;
  let fixture: ComponentFixture<WelcomeflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
