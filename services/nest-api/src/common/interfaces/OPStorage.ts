export interface OPStorage {
    appendToSheets({values,range}:{values:(string|boolean)[][],range:string}):Promise<{ok:boolean,data:any}>;
    getOpId(sheetName:"JamalConfig"|"JimsConfig"):Promise<{ok:boolean,data:string}>;

}