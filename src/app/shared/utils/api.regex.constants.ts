export const RegexConstants = {
    PassportNumber: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
    OnlyAlpha: /^[a-zA-Z\s]{2,40}$/, // Only alpha values with space
    AlphaWithSymbol: /^[a-zA-Z!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\s]{2,40}$/,
    Alphanumeric: /^[a-zA-Z0-9]*$/,
    AlphanumericSpace: /^[a-zA-Z0-9\s]*$/,
    CharactersLimit: /\w{10,15}/, // Characters length should be 10 to 15
    OnlyNumeric: /[^0-9]/g, // Only numeric values
    OTP: /(?:[0-9])/,
    Password: {
        Full: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\s])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\s]{8,20}$/,
        length: /^.{8,20}$/, // Characters length should be 8 to 20
        UpperLower: /^(?=.*[a-z])(?=.*[A-Z])/, // Should have atleast one lower case and one upper case
        NumberSymbol: /^(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\s])/ // Should have atleast one number and one speacial symbol
    },
    EmailOrMobile: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{8,10})+$/,
    AlphanumericWithSpaces: /^[a-zA-Z0-9\s]*$/,
    SixDigitNumber: /^[0-9]{6}$/,
    SixDigitPromo: /^[a-zA-Z0-9]{6}$/,
    OnlyAlphaWithoutLimit: /^[a-zA-Z\s]*$/,
    NameWithSymbol: /^[a-zA-Z!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\s]+$/,
    UIN: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,15}$/,
    ContactNumber: /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/,
    Email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    NRIC: /^[STst][a-zA-Z0-9]{8}$/,
    SymbolNumber: /^[0-9\s!@#~$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
    NumericOnly: /^[0-9]*$/,
    SymbolAlphabets: /^[a-zA-Z\s!@#~$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
    AlphanumericWithSymbol: /^[a-zA-Z0-9\s!@#~$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
    TenToFifteenNumbers: /^[0-9]{10,15}$/,
    MalaysianTin: /^[A-Za-z]{1,2}[0-9]{10,11}$/, // AB1234567890
    IndonesianTin: /^[0-9]{2}[.][0-9]{3}[.][0-9]{3}[.][0-9]{1}[-][0-9]{3}[.][0-9]{3}$/, // 00.123.456.1-000.333
    IndianTin: /^([a-zA-Z]){3}[PCHFATBLJG]{1}([a-zA-Z]){1}([0-9]){4}([a-zA-Z]){1}?$/, // AFZPK7190K
    ChineseTin: /^[0-9a-zA-Z]{15,18}$/, // 12345678901234567
    PhillipinesTin: /^[0-9]{3}[-][0-9]{3}[-][0-9]{3}[-][0-9]{3}$/, // 123-456-789-123,
    BankAccountNumber: {
        BANK_OF_CHINA: /^[0-9]{15}$/,
        STANDARD_CHARTED_BANK: /^[0-9]{10}$/,
        DBS: /^[0-9]{10}$/,
        CITIBANK: /^[0-9]{10}$/,
        MAYBANK: /^[0-9]{11}$/,
        OCBC: /^([0-9]{10}|[0-9]{12})$/,
        RHB_BANK: /^[0-9]{11}$/,
        UOB: /^[0-9]{10}$/,
        ANZ_BANK: /^[0-9]{10}$/,
        CIMB: /^[0-9]{10}$/,
        HSBC: /^[0-9]{12}$/,
        POSB: /^[0-9]{9}$/
    },
    operator: {
        DBS: /^[0-9]{4}[-][0-9]{6}[-][0-9]{4}$/,
        OCBC: /^[0-9]{3}[-][0-9]{6}[-][0-9]{3}$/,
        UOB: /^[0-9]{2}[-][0-9]{4}[-][0-9]{2}$/,
    },
    operatorMask: {
        DBS: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/], /* 4-6-4 */
        OCBC: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/], /* 3-6-3 */
        UOB: [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/], /* 2-5-2 */
    },
    operatorMaskForValidation: {
        DBS: /^\d{4}-?\d{6}-?\d{4}$/, /* 4-6-4 */
        OCBC: /^\d{3}-?\d{6}-?\d{3}$/, /* 3-6-3 */
        UOB: /^\d{2}-?\d{5}-?\d{2}$/, /* 2-5-2 */
    },
    MobileNumber: /^(8|9)\d{7}$/,
    portfolioName: /^\S.*$/
};
