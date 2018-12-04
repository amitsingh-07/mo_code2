import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadWillComponent } from './download-will.component';

describe('DownloadWillComponent', () => {
  let component: DownloadWillComponent;
  let fixture: ComponentFixture<DownloadWillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadWillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadWillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
