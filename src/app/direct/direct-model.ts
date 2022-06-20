export interface InterestedInsuranceInListRes {
    responseMessage: ResponseMessage;
    objectList: string[];
}
  
export interface ResponseMessage {
    responseCode: number;
    responseDescription: string;
}