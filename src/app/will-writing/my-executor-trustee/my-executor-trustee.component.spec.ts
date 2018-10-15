import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExecutorTrusteeComponent } from './my-executor-trustee.component';

describe('MyExecutorTrusteeComponent', () => {
  let component: MyExecutorTrusteeComponent;
  let fixture: ComponentFixture<MyExecutorTrusteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExecutorTrusteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExecutorTrusteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
