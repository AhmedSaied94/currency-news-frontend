import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import theme from "./styles/Theme";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </div>
  );
}

export default App;
