import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpBizSignupWithDataComponent } from './corp-biz-signup-with-data.component';

describe('CorpBizSignupWithDataComponent', () => {
  let component: CorpBizSignupWithDataComponent;
  let fixture: ComponentFixture<CorpBizSignupWithDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CorpBizSignupWithDataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpBizSignupWithDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
