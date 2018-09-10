import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelWithButtonComponent } from './model-with-button.component';

describe('ModelWithButtonComponent', () => {
  let component: ModelWithButtonComponent;
  let fixture: ComponentFixture<ModelWithButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelWithButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelWithButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
