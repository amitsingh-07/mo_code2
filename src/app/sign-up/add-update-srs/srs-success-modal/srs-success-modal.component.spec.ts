import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrsSuccessModalComponent } from './srs-success-modal.component';

describe('SrsSuccessModalComponent', () => {
  let component: SrsSuccessModalComponent;
  let fixture: ComponentFixture<SrsSuccessModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SrsSuccessModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrsSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
