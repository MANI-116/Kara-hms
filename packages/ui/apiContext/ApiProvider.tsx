import React,{ createContext, useContext} from "react";
import type { ApiClient } from "../../apiClient/apiclient";

const ApiClientContext = createContext<ApiClient | null>(null);

export const ApiClientProvider = ({client,children}:{client:ApiClient;children:React.ReactNode})=>(
<ApiClientContext.Provider value={client}>
    {children}
</ApiClientContext.Provider>
)
    
export const useApiClient= ():ApiClient=>{
    const context = useContext(ApiClientContext);
    if(!context) {
        throw new Error("ApiClinet not provided");
    }
    return context;
}