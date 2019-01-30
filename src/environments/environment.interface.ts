export interface IEnvironment {
    production: boolean;
    isDebugMode: boolean;
    apiBaseUrl: string;
    myInfoClientId: string;
    myInfoCallbackBaseUrl: string;
    myInfoAuthorizeUrl: string;
    gaPropertyId: string; // Google Analytics
    gtagPropertyId?: string; // Google Pixel
    fbPropertyId?: string; // Facebook Pixel
    adRollPropertyId?: string; // AdRoll Property Id
    adRollAdvId?: string; // AdRoll Advert Id
    projectG ?: boolean; // Project G
}
