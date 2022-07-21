export class SignUpFormData {
  countryCode: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  marketingAcceptance: boolean;
  password: string;
  fullName: string;
  nricNumber: any;
  dob: any;
  singleLineDOB: string; // for API payload
  gender: string;
  disableAttributes: any;
  isMyInfoEnabled: boolean;

  // Login
  loginUsername: string;
  loginPassword: string;

  // Forgot Password
  forgotPassEmail: string;

  // Reset Password
  resetPassword1: string;
  confirmPassword: string;

  // User information after the login
  userProfileInfo: any;

  //notification list
  notificationList: any;
  // Edit/Update Contact
  OldCountryCode: string;
  OldMobileNumber: string;
  OldEmail: string;
  editContact: boolean;
  updateMobile: boolean;
  updateEmail: boolean;

  isUnsupportedNoteShown: boolean;
  buyRequestFlag: boolean;
  //srs detail
  srsAccountNumber: number;
  srsOperatorBank: any;
  customerId: number;
  fundTypeId: number;
  // referral code
  referralCode: string;
  userType: string;
  accountCreationType: string;
  organisationCode?: string;
  // cpf detail
  cpfAccountNumber: number;
  cpfOperatorBank: any;

  // payload details for corpbiz
  enrolmentId: number;
  isCorpBizEnrollUser: boolean;
}

export class CorpBizUserMyInfoData {
  // Corp Biz Status My info flag
  isCorpBizMyInfoEnabled: boolean
  
   // CorpBiz user data from MyInfo
   marital: string;
   regadd: string;
   dateOfBirth: any;
   uinfin: string;
   childrenRecords: Child[];
   sponsoredChildrenRecords: Child[];
   residentialstatus: string;
   cpfhousingwithdrawal: CPFWithdrawal[];
   noa: Noa;
   cpfBalances: CPFBalances;
   race: any;
   birthCountry: any;
   hdbProperty: any;
   vehicles: any;
   ownershipStatus: string;
}
export class CPFBalances {
  sa: number;
  ma: number;
  oa: number;
  ra: number;
}

export class Noa {
  type: string | null;
  yearOfAssessment: number | null;
  trade: number | null;
  employment: number | null;
  rent: number | null;
  interest: number | null;
  taxClearance: string | null;
  assessableIncome: number | null;
}

export class CPFWithdrawal {
  withdrawalAmount: number | null;
  installmentAmount: number | null;
  acruedInterest: number | null;
  totalCPFAmount: number | null;
  withdrawalAddress: string;
}

export class Child {
  name: string | null;
  dob: string | null;
  gender: string;
  residentialStatus: string;
  lifeStatus: string;
}