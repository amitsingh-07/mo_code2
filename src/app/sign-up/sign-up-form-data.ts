export class SignUpFormData {
    countryCode: number;
    mobileNumber: number;
    firstName: string;
    lastName: string;
    email: string;
    termsOfConditions: boolean;
    marketingAcceptance: boolean;
    password: string;

    // Login
    loginUsername: string;
    loginPassword: string;

    // Forgot Password
    forgotPassEmail: string;
}
