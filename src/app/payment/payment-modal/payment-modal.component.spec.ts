import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentModalComponent } from './payment-modal.component';

describe('PaymentModalComponent', () => {
  let component: PaymentModalComponent;
  let fixture: ComponentFixture<PaymentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentModalComponent],
      imports: [
        TranslateModule.forRoot(),
        NgbModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [NgbActiveModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create PaymentModalComponent', () => {
    expect(component).toBeTruthy();
    fixture.whenStable().then(() => {
      const debugElement = fixture.debugElement;
      // should be rendered initially
      // check if modalDiv exist on init
      const modalDiv = debugElement.query(By.css('.modal-div'));
      fixture.detectChanges();
      expect(modalDiv).toBeTruthy();
    });
  });
});
