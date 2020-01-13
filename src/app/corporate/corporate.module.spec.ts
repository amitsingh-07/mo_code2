import { CorporateModule } from './corporate.module';

describe('CorporateModule', () => {
  let corporateModule: CorporateModule;

  beforeEach(() => {
    corporateModule = new CorporateModule();
  });

  it('should create an instance', () => {
    expect(corporateModule).toBeTruthy();
  });
});
