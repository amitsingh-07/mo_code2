import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointAccountUploadDocumentComponent } from './joint-account-upload-document.component';

describe('JointAccountUploadDocumentComponent', () => {
  let component: JointAccountUploadDocumentComponent;
  let fixture: ComponentFixture<JointAccountUploadDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointAccountUploadDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointAccountUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
