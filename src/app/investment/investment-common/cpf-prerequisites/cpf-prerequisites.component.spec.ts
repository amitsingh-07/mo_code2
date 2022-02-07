import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpfPrerequisitesComponent } from './cpf-prerequisites.component';

describe('CpfPrerequisitesComponent', () => {
  let component: CpfPrerequisitesComponent;
  let fixture: ComponentFixture<CpfPrerequisitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpfPrerequisitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpfPrerequisitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
