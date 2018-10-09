import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellUsAboutYourselfComponent } from './tell-us-about-yourself.component';

describe('TellUsAboutYourselfComponent', () => {
  let component: TellUsAboutYourselfComponent;
  let fixture: ComponentFixture<TellUsAboutYourselfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellUsAboutYourselfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellUsAboutYourselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
