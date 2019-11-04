import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SRSOfflineErrorModalComponent } from './srs-offline-error-modal.component';

describe('SRSOfflineErrorModalComponent', () => {
  let component: SRSOfflineErrorModalComponent;
  let fixture: ComponentFixture<SRSOfflineErrorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SRSOfflineErrorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SRSOfflineErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
