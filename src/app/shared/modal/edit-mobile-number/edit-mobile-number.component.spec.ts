import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMobileNumberComponent } from './edit-mobile-number.component';

describe('EditMobileNumberComponent', () => {
  let component: EditMobileNumberComponent;
  let fixture: ComponentFixture<EditMobileNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMobileNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMobileNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
