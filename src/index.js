import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        transitionProperty: "all",
        transitionDuration: "slow",
      },
    },
  },
  config: {
    disableTransitionOnChange: false,
  },
  fonts: {
    heading: `'Ubuntu Mono', monospace`,
    body: `'Ubuntu Mono', monospace`,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
