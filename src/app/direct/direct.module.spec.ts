import { DirectModule } from './direct.module';

describe('DirectModule', () => {
  let directModule: DirectModule;

  beforeEach(() => {
    directModule = new DirectModule();
  });

  it('should create an instance', () => {
    expect(directModule).toBeTruthy();
  });
});
