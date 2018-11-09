import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointYourExecutorTrusteeComponent } from './appoint-your-executor-trustee.component';

describe('AppointYourExecutorTrusteeComponent', () => {
  let component: AppointYourExecutorTrusteeComponent;
  let fixture: ComponentFixture<AppointYourExecutorTrusteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointYourExecutorTrusteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointYourExecutorTrusteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
