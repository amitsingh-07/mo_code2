import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailEnquirySuccessComponent } from './email-enquiry-success.component';

describe('EmailEnquirySuccessComponent', () => {
  let component: EmailEnquirySuccessComponent;
  let fixture: ComponentFixture<EmailEnquirySuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailEnquirySuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailEnquirySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
