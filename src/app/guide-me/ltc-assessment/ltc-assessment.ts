export class LongTermCare {
    careGiverType: string;
    careGiverDescription: string;
    careGiverTypeId: number;
    monthlyPayout = 0;
};

export const LONG_TERM_CARE_SHIELD = {
    MAX_YEAR: 1990,
    MIN_YEAR: 1980,
    AGE: 30,
    TYPE: 'family member'
};
