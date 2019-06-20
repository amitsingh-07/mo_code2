import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleEnquiryComponent } from './bundle-enquiry.component';

describe('BundleEnquiryComponent', () => {
  let component: BundleEnquiryComponent;
  let fixture: ComponentFixture<BundleEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
