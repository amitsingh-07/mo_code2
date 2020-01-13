import { TestBed } from '@angular/core/testing';
import { HeaderService } from '../shared/header/header.service';
import { NavbarService } from '../shared/navbar/navbar.service';
import { DirectModule } from './direct.module';

describe('DirectModule', () => {
  let directModule: DirectModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NavbarService, HeaderService] });
    let navbarService = TestBed.get(NavbarService);
    let headerService = TestBed.get(HeaderService);
    directModule = new DirectModule(navbarService, headerService);
  });

  it('should create an instance', () => {
    expect(directModule).toBeTruthy();
  });
});
