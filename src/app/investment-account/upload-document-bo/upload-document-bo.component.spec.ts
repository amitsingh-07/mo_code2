import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentBOComponent } from './upload-document-bo.component';

describe('UploadDocumentBOComponent', () => {
  let component: UploadDocumentBOComponent;
  let fixture: ComponentFixture<UploadDocumentBOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocumentBOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentBOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
