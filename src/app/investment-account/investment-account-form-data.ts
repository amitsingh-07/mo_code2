export class InvestmentAccountFormData {
    // Personal Information
    fullName: string;
    firstName: string;
    lastName: string;
    nricNumber: any;
    passportNumber: any;
    passportExpiry: any;
    dob: any;
    gender: string;

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

    // SELECTNATIONLITY
    nationalitylist: any;
    nationality: any;
    unitedStatesResident: string;
    singaporeanResident: string;

    // Tax Info
    taxCountry: any;
    radioTin: any;
    tinNumber: any;
    noTinReason: any;

    // EmployementDetails

    employmentStatus: string;
    employStatus: string;
    companyName: string;
    occupation: string;
    industry: string;
    contactNumber: string;
    isEmployeAddresSame: boolean;
    empCountry: string;
    empPostalCode: number;
    empAddress1: string;
    empAddress2: string;
    empUnitNo: string;
    empCity: string;
    empState: string;
    empZipCode: number;

    // Upload documents
    nricFrontImage: File;
    nricBackImage: File;
    mailAdressProof: File;
    passportImage: File;
    resAddressProof: File;

    // Personal Declaration
    sourceOfIncome: any;
    ExistingEmploye: any;
    pep: any;
    beneficial: any;

    // financial details
    annualHouseHoldIncomeRange: string;
    numberOfHouseHoldMembers: number;
    financialMonthlyIncome: string;
    financialPercentageOfSaving: string;
    financialTotalAssets: string;
    financialTotalLiabilities: string;

    source: string;
    expectedNumberOfTransation: string;
    expectedAmountPerTranction: string;
    personalSavings: string;
    otherSources: string;
    inheritanceGift: string;
    investmenteEarning: string;
    investmentPeriod: string;
    earningsGenerated: string;

    // Additional declaration PEP
    radioPep: any;
    fName: string;
    lName: string;
    cName: string;
    pepoccupation: string;
    pepCountry: string;
    pepPostalCode: number;
    pepAddress1: string;
    pepAddress2: string;
    pepUnitNo: string;
}
