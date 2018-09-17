import { IfastAccountModule } from './ifast-account.module';

describe('IfastAccountModule', () => {
  let ifastAccountModule: IfastAccountModule;

  beforeEach(() => {
    ifastAccountModule = new IfastAccountModule();
  });

  it('should create an instance', () => {
    expect(ifastAccountModule).toBeTruthy();
  });
});
