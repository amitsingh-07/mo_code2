import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMyInfoComponent } from './test-my-info.component';

describe('TestMyInfoComponent', () => {
  let component: TestMyInfoComponent;
  let fixture: ComponentFixture<TestMyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
