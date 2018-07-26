import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectionNeedsComponent } from './protection-needs.component';

describe('ProtectionNeedsComponent', () => {
  let component: ProtectionNeedsComponent;
  let fixture: ComponentFixture<ProtectionNeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtectionNeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectionNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
