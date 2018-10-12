import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDeclarationInfoComponent } from './additional-declaration-info.component';

describe('AdditionalDeclarationInfoComponent', () => {
  let component: AdditionalDeclarationInfoComponent;
  let fixture: ComponentFixture<AdditionalDeclarationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalDeclarationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclarationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
