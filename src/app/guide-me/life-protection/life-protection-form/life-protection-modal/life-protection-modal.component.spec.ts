import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeProtectionModalComponent } from './life-protection-modal.component';

describe('LifeProtectionModalComponent', () => {
  let component: LifeProtectionModalComponent;
  let fixture: ComponentFixture<LifeProtectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeProtectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeProtectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
