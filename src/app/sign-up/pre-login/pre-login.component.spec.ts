import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLoginComponent } from './pre-login.component';

describe('PreLoginComponent', () => {
  let component: PreLoginComponent;
  let fixture: ComponentFixture<PreLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PreLoginComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
