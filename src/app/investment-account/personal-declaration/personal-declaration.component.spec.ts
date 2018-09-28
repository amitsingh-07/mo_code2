import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDeclarationComponent } from './personal-declaration.component';

describe('PersonalDeclarationComponent', () => {
  let component: PersonalDeclarationComponent;
  let fixture: ComponentFixture<PersonalDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
