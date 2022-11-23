import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRadioControllerComponent } from './custom-radio-controller.component';

describe('CustomRadioControllerComponent', () => {
  let component: CustomRadioControllerComponent;
  let fixture: ComponentFixture<CustomRadioControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomRadioControllerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomRadioControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
