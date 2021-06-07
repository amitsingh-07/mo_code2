import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalRedirectingPartComponent } from './referal-redirecting-part.component';

describe('ReferalRedirectingPartComponent', () => {
  let component: ReferalRedirectingPartComponent;
  let fixture: ComponentFixture<ReferalRedirectingPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferalRedirectingPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferalRedirectingPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
