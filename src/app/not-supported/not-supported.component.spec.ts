import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotSupportedComponent } from './not-supported.component';

describe('NotSupportedComponent', () => {
  let component: NotSupportedComponent;
  let fixture: ComponentFixture<NotSupportedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotSupportedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotSupportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
