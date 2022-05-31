import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountMyinfoModalComponent } from './create-account-myinfo-modal.component';

describe('CreateAccountMyinfoModalComponent', () => {
  let component: CreateAccountMyinfoModalComponent;
  let fixture: ComponentFixture<CreateAccountMyinfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountMyinfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountMyinfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
