import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountMyinfoComponent } from './create-account-myinfo.component';

describe('CreateAccountMyinfoComponent', () => {
  let component: CreateAccountMyinfoComponent;
  let fixture: ComponentFixture<CreateAccountMyinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountMyinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountMyinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
