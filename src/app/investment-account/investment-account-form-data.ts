import { FormArray, FormGroup } from '@angular/forms';

export class InvestmentAccountFormData {

    // countries
    countries: [];

    // selectnationality
    nationality: string;
    selectNationalitySig: string;

    // Residential Address
    country: string;
    postalCode: number;
    address1: string;
    address2: string;
    unitNo: string;
    isMailingAddressSame: boolean;
    city: string;
    state: string;
    zipCode: number;
}
