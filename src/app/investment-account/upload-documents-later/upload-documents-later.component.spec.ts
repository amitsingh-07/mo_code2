import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentsLaterComponent } from './upload-documents-later.component';

describe('UploadDocumentsLaterComponent', () => {
  let component: UploadDocumentsLaterComponent;
  let fixture: ComponentFixture<UploadDocumentsLaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocumentsLaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentsLaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
