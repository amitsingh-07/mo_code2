import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpLoginComponent } from './corp-login.component';

describe('CorpLoginComponent', () => {
  let component: CorpLoginComponent;
  let fixture: ComponentFixture<CorpLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorpLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
