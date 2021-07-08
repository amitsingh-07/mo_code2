import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtucMemberComponent } from './ntuc-member.component';

describe('NtucMemberComponent', () => {
  let component: NtucMemberComponent;
  let fixture: ComponentFixture<NtucMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtucMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtucMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
