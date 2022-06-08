import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeflowTellAboutYouComponent } from './welcome-flow-tell-about-you.component';

describe('WelcomeflowTellAboutYouComponent', () => {
  let component: WelcomeflowTellAboutYouComponent;
  let fixture: ComponentFixture<WelcomeflowTellAboutYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeflowTellAboutYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeflowTellAboutYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
