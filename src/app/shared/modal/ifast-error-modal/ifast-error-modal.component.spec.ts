import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IfastErrorModalComponent } from './ifast-error-modal.component';

describe('IfastErrorModalComponent', () => {
  let component: IfastErrorModalComponent;
  let fixture: ComponentFixture<IfastErrorModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IfastErrorModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfastErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
