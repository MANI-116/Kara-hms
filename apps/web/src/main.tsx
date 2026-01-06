
import { createRoot } from "react-dom/client";
import App from "@hms/ui";
import "./index.css";
import { ApiClientProvider } from "../../../packages/ui/apiContext/ApiProvider"
import { WebApiClient } from './adapters/webAdapter';

const apiClient = new WebApiClient(); 

  createRoot(document.getElementById("root")!).render(
  <ApiClientProvider client={apiClient}>
    <App />
  </ApiClientProvider>);
  