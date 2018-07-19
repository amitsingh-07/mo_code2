import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPageComponent } from './start-page.component';

describe('StartPageComponent', () => {
  let component: StartPageComponent;
  let fixture: ComponentFixture<StartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render title in a .Financial-Assessment', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.Financial-Assessment').textContent).toContain('Financial Assessment');
  }));
  it('testing the proceed button', async(() => {
    spyOn(component, 'goNext');

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.goNext).toHaveBeenCalled();
    });
  }));
});
