import * as React from "react";
import MainTable from "../components/MainTable";
import BasesTable from "../components/BasesTable";
import Metals from "../components/Metals";
import { axiosFetchInstance } from "../Axios";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import theme from "../styles/Theme";
import { Box } from "@mui/system";

const Home = () => {
  const [bases, setBases] = React.useState([]);
  const [metals, setMetals] = React.useState([]);
  const [allCurs, setAllCurs] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies(["currency_news"]);

  React.useEffect(() => {
    const script = document.createElement("script");

    script.src = "http://localhost:8000/iframe/";
    // script.async = true;
    document.getElementById("if").appendChild(script);
  }, []);

  return (
    <Box
      sx={{
        background:
          "linear-gradient(rgb(248, 250, 253) 0%, rgba(248, 250, 253, 0) 413px);",
        "& .MuiDataGrid-root": {
          borderBottom: 0,
          borderRight: 0,
          borderLeft: 0,
          borderRadius: 0,
          fontWeight: 500,
        },
        "& .normalCell": {
          color: theme.palette.grey.dark,
          fontSize: "0.9em",
          fontWeight: 500,
        },
        "& .MuiDataGrid-footerContainer": {
          display: "none",
        },
        "& .MuiDataGrid-iconSeparator": {
          display: "none",
        },
      }}
    >
      <div
        style={{
          height: "300px",
          padding: "16px",
        }}
      >
        this is my awesome frame it sayes{" "}
        {/* <iframe
          style={{ display: "inline", width: "fit-content" }}
          src="http://localhost:8000/iframe/"
        ></iframe>{" "} */}
        {/* <script src="http://localhost:8000/iframe/"></script> */}
        <span id="if"></span>
        you like it did you?
      </div>
      <BasesTable />
      <div
        style={{
          height: "300px",
          margin: "1rem 0",
        }}
      ></div>
      <Metals metals={metals} />
    </Box>
  );
};

export default Home;
