import { RetirementPlanningModule } from './retirement-planning.module';

describe('RetirementPlanningModule', () => {
  let retirementPlanningModule: RetirementPlanningModule;

  beforeEach(() => {
    retirementPlanningModule = new RetirementPlanningModule();
  });

  it('should create an instance', () => {
    expect(retirementPlanningModule).toBeTruthy();
  });
});
