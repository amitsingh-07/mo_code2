import { HospitalPlan } from './../../../guide-me/hospital-plan/hospital-plan';
export interface IHospital {
    gender: string;
    dob: string;
    fullOrPartialRider: boolean;
    selectedPlan: HospitalPlan;
}
