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
    city: string;
    state: string;
    zipCode: number;
    isMailingAddressSame: boolean;
    mailCountry: string;
    mailPostalCode: number;
    mailAddress1: string;
    mailAddress2: string;
    mailUnitNo: string;
    mailCity: string;
    mailState: string;
    mailZipCode: number;
}
