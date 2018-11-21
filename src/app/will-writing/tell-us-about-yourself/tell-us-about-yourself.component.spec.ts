import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellUsAboutYourselfComponent } from './tell-us-about-yourself.component';

describe('TellUsAboutYourselfComponent', () => {
  let component: TellUsAboutYourselfComponent;
  let fixture: ComponentFixture<TellUsAboutYourselfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellUsAboutYourselfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellUsAboutYourselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render step-title in a intro-block__content__heading', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('intro-block__content__heading').textContent).toContain('Step 1');
  }));
  it('should render start-title in a intro-block__content__title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('intro-block__content__title').textContent).toContain('Tell Us About Yourself');
  }));
  it('should render sub-title in a intro-block__content__sub-title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('intro-block__content__sub-title').textContent).toContain('In the next step, we will be gathering personal information about you that will be reflected in your will.');
  }));
  it('testing the proceed button', async(() => {
    spyOn(component, 'goToNext');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));
});
