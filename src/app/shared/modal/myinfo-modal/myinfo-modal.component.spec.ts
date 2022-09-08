import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyinfoModalComponent } from './myinfo-modal.component';

describe('MyinfoModalComponent', () => {
  let component: MyinfoModalComponent;
  let fixture: ComponentFixture<MyinfoModalComponent>;

  beforeEach(async(() => {
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
