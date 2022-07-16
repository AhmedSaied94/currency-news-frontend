import React from "react";
import { Box } from "@mui/material";
import {
  FacebookShareButton,
  TwitterShareButton,
  InstapaperShareButton,
  InstapaperIcon,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
} from "react-share";
import { GrFacebook, GrTwitter } from "react-icons/gr";
import { RiWhatsappFill, RiTelegramFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import theme from "../styles/Theme";
import { useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
const NewsShare = () => {
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();

  return (
    <Box
      sx={{
        alignSelf: "center",
        display: "flex",
        flexDirection: matches ? "column" : "row",
        "& .share": {
          width: 30,
          height: 30,
          borderRadius: "3px",
          mx: matches ? "none" : 2,
        },
      }}
    >
      <FacebookShareButton
        children={<GrFacebook className="share" />}
        url={"http://38.242.255.43" + location.pathname}
      />
      <TwitterShareButton
        children={<GrTwitter className="share" />}
        url={"http://38.242.255.43" + location.pathname}
      />
      <EmailShareButton
        children={<MdEmail className="share" />}
        url={"http://38.242.255.43" + location.pathname}
      />
      <WhatsappShareButton
        children={<RiWhatsappFill className="share" />}
        url={"http://38.242.255.43" + location.pathname}
      />
      <TelegramShareButton
        children={<RiTelegramFill className="share" />}
        url={"http://38.242.255.43" + location.pathname}
      />
    </Box>
  );
};

export default NewsShare;
