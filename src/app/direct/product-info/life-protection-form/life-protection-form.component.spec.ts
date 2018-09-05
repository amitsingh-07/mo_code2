import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeProtectionFormComponent } from './life-protection-form.component';

describe('LifeProtectionFormComponent', () => {
  let component: LifeProtectionFormComponent;
  let fixture: ComponentFixture<LifeProtectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeProtectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeProtectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
