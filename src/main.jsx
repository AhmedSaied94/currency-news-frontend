import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import Store from "./Store";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <CookiesProvider>
    <SnackbarProvider>
      <Provider store={Store}>
        <App />
      </Provider>
    </SnackbarProvider>
  </CookiesProvider>
  // </React.StrictMode>
);
