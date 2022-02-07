import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkaUploadDocumentComponent } from './cka-upload-document.component';

describe('CkaUploadDocumentComponent', () => {
  let component: CkaUploadDocumentComponent;
  let fixture: ComponentFixture<CkaUploadDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkaUploadDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkaUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
