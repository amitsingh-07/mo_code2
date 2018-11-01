import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WillDisclaimerComponent } from './will-disclaimer.component';

describe('WillDisclaimerComponent', () => {
  let component: WillDisclaimerComponent;
  let fixture: ComponentFixture<WillDisclaimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WillDisclaimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WillDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
