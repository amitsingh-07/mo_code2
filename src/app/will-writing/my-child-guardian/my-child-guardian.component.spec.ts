import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChildGuardianComponent } from './my-child-guardian.component';

describe('MyChildGuardianComponent', () => {
  let component: MyChildGuardianComponent;
  let fixture: ComponentFixture<MyChildGuardianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyChildGuardianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyChildGuardianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
