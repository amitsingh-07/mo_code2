import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsComponent } from './about-us.component';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutUsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the about us component', () => {
    const fixture = TestBed.createComponent(AboutUsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('About MoneyOwl');
    expect(component).toBeTruthy();
  });
});
