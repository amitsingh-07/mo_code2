import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentialAddressComponent } from './residential-address.component';

describe('ResidentialAddressComponent', () => {
  let component: ResidentialAddressComponent;
  let fixture: ComponentFixture<ResidentialAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidentialAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentialAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
