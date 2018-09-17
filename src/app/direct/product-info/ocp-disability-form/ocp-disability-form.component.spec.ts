import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcpDisabilityFormComponent } from './ocp-disability-form.component';

describe('OcpDisabilityFormComponent', () => {
  let component: OcpDisabilityFormComponent;
  let fixture: ComponentFixture<OcpDisabilityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcpDisabilityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcpDisabilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
