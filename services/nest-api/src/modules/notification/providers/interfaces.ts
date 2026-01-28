export interface EmailPayload {
    html:string,
    to:string,
    subject:string
}

interface Smspayload {
    meassage:string,
    to:string
}

export interface EmailProviderInterface {
    send(payload:EmailPayload):Promise<any>,

}

export interface SMSProviderInterface {
    send(payload:Smspayload):Promise<void>
}