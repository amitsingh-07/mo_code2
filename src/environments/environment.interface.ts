export interface IEnvironment {
    production: boolean;
    isDebugMode: boolean;
    apiBaseUrl: string;
    myInfoClientId: string;
    myInfoCallbackBaseUrl: string;
    myInfoAuthorizeUrl: string;
    gtagPropertyId: string;
    gaPropertyId: string;
    fbPropertyId: string;
}
