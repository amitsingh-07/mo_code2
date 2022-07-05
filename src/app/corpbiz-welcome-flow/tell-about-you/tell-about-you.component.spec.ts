import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellAboutYouComponent } from './tell-about-you.component';

describe('TellAboutYouComponent', () => {
  let component: TellAboutYouComponent;
  let fixture: ComponentFixture<TellAboutYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellAboutYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellAboutYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
