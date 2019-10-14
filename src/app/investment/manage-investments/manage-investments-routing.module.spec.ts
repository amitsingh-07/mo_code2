import { ManageInvestmentsRoutingModule } from './manage-investments-routing.module';

describe('GuideMeRoutingModule', () => {
  let manageInvestmentsRoutingModule: ManageInvestmentsRoutingModule;

  beforeEach(() => {
    manageInvestmentsRoutingModule = new ManageInvestmentsRoutingModule();
  });

  it('should create an instance', () => {
    expect(manageInvestmentsRoutingModule).toBeTruthy();
  });
});
