import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyinfoModalComponent } from './myinfo-modal.component';

describe('MyinfoModalComponent', () => {
  let component: MyinfoModalComponent;
  let fixture: ComponentFixture<MyinfoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyinfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyinfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
