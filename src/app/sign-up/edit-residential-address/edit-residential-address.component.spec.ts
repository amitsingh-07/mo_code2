import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResidentialAddressComponent } from './edit-residential-address.component';

describe('EditResidentialAddressComponent', () => {
  let component: EditResidentialAddressComponent;
  let fixture: ComponentFixture<EditResidentialAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditResidentialAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResidentialAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
