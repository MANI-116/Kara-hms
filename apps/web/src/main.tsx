
import { createRoot } from "react-dom/client";
import AppWrapper  from "@hms/ui";
import { Theme} from "@radix-ui/themes"
import "./index.css"
import { ApiClientProvider } from "../../../packages/ui/apiContext/ApiProvider"
import { WebApiClient } from './adapters/webAdapter';
import LoginPage from "./pages/LoginPage";
import LabPage from "./pages/LabPage";
import PharmacyPage from "./pages/PharmacyPage";
const apiClient = new WebApiClient(); 


  createRoot(document.getElementById("root")!).render(
  <ApiClientProvider client={apiClient}>
   <>
   <Theme>
    <PharmacyPage />
    <LabPage></LabPage>
   {/* <LoginPage onSuccessLogin={()=>{console.log("successfull")}}/> */}
    </Theme>
   {/* <AppWrapper /> */}
   </> 
  </ApiClientProvider>);
  