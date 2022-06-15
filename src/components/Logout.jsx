import React from "react";
import { useCookies } from "react-cookie";

const Logout = ({ path }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["currency_news"]);
  React.useEffect(() => {
    removeCookie("tokens", { path: "/" });
    window.location.href = path;
  }, []);
  return <div></div>;
};

export default Logout;
