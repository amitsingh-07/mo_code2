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

  // Corp Biz Status My info flag
  isCorpBizMyInfoEnabled: boolean

  // payload details for corpbiz
  enrolmentId: number;
  isCorpBizEnrolluser: boolean;

  // CorpBiz user data from MyInfo
  marital: any;
  regadd: any;
  uinfin: string;
  childrenRecords: any;
  sponsoredChildrenRecords: any;
  residentialstatus: string;
  cpfhousingwithdrawal: any;
  noa: any;
  cpfBalances: CPFBalances;
  race: any;
  birthCountry: any;
  hdbProperty: any;
  vehicles: any;
}

export class CPFBalances {
  sa: number;
  ma: number;
  oa: number;
  ra: number;
}
