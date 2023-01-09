import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpBizSignupComponent } from './corp-biz-signup.component';

describe('CorpBizSignupComponent', () => {
  let component: CorpBizSignupComponent;
  let fixture: ComponentFixture<CorpBizSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CorpBizSignupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpBizSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
