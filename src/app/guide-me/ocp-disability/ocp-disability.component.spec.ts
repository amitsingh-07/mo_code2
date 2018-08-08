import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcpDisabilityComponent } from './ocp-disability.component';

describe('OcpDisabilityComponent', () => {
  let component: OcpDisabilityComponent;
  let fixture: ComponentFixture<OcpDisabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcpDisabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcpDisabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
