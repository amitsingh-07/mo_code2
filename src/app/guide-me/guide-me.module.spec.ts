import { GuideMeModule } from './guide-me.module';
import { TestBed } from '@angular/core/testing';
import { NavbarService } from '../shared/navbar/navbar.service';

describe('GuideMeModule', () => {
  let guideMeModule: GuideMeModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NavbarService] });
    let navbarService = TestBed.get(NavbarService);
    guideMeModule = new GuideMeModule(navbarService);
  });

  it('should create an instance', () => {
    expect(guideMeModule).toBeTruthy();
  });
});
