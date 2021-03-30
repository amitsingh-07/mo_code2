export class SignUpFormData {
  countryCode: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  marketingAcceptance: boolean;
  password: string;
  fullName:string;
  nricNumber:any;
  callBackInvestmentAccount :boolean;
  disableAttributes :any;
  isMyInfoEnabled :boolean;
  
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
  accountCreationType:string;
}
