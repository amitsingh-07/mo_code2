export class SignUpFormData {
    countryCode: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    marketingAcceptance: boolean;
    password: string;

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

    // Edit Contact
    editContact: boolean;
    updateMobile: boolean;
    updateEmail: boolean;
}
