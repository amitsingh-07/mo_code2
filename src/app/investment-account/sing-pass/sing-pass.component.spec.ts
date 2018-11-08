import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingPassComponent } from './sing-pass.component';

describe('SingPassComponent', () => {
  let component: SingPassComponent;
  let fixture: ComponentFixture<SingPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
