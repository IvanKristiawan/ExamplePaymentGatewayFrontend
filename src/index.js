import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProSidebarProvider } from "react-pro-sidebar";
import { ContextProvider } from "./contexts/ContextProvider";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ContextProvider>
      <ProSidebarProvider>
        <App />
      </ProSidebarProvider>
    </ContextProvider>
  </StrictMode>
);
