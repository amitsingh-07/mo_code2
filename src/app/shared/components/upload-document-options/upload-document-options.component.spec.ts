import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentOptionsComponent } from './upload-document-options.component';

describe('UploadDocumentOptionsComponent', () => {
  let component: UploadDocumentOptionsComponent;
  let fixture: ComponentFixture<UploadDocumentOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDocumentOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDocumentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
