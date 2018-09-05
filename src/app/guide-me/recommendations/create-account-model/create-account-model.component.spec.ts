import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountModelComponent } from './create-account-model.component';

describe('CreateAccountModelComponent', () => {
  let component: CreateAccountModelComponent;
  let fixture: ComponentFixture<CreateAccountModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
