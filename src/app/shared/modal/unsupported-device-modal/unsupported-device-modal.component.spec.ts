import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelWithButtonComponent } from './../model-with-button/model-with-button.component';

describe('ModelWithButtonComponent', () => {
  let component: ModelWithButtonComponent;
  let fixture: ComponentFixture<ModelWithButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModelWithButtonComponent]
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
