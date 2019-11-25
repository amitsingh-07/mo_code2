import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquirySuccessComponent } from './enquiry-success.component';

describe('EnquirySuccessComponent', () => {
  let component: EnquirySuccessComponent;
  let fixture: ComponentFixture<EnquirySuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquirySuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquirySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
