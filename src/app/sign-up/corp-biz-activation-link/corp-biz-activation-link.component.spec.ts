import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpBizActivationLinkComponent } from './corp-biz-activation-link.component';

describe('CorpBizActivationlinkComponent', () => {
  let component: CorpBizActivationLinkComponent;
  let fixture: ComponentFixture<CorpBizActivationLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CorpBizActivationLinkComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpBizActivationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
