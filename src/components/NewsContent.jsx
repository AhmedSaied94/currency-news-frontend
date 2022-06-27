import React from "react";
import { Box } from "@mui/material";
import { Typography, Divider } from "@mui/material";
import theme from "../styles/Theme";

const fall = ["نزل", "هبط", "تراجع", "انخفض", "انحسر"];
const rise = ["صعد", "ارتفع", "قفز", "انتعش", "زاد"];
const stapility = ["استقر", "ثبت", "ظل", "بقي", "استمر"];
const connect = [
  "كذلك",
  "بينما",
  "ايضا",
  "بالتزامن",
  "في الأثناء",
  "بالوقت نفسه",
  "في غضون ذلك",
  "كما",
  "بالتبعية",
];

const NewsContent = ({ news }) => {
  const [vocs, setVocs] = React.useState([]);
  React.useEffect(() => {
    if (news.value) {
      news.value.ounce > news.close_value.ounce
        ? setVocs(rise)
        : news.value.ounce < news.close_value.ounce
        ? setVocs(fall)
        : setVocs(stapility);
    }
  }, []);

  return (
    <Box sx={{ textAlign: "right", px: 3 }}>
      <Box>
        <Typography component="h1" variant="h2">
          {news.header}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography
          sx={{ color: theme.palette.grey.dark }}
          component="p"
          variant="caption"
        >
          تم النشر في {news.ar_date}
        </Typography>
      </Box>
      <Typography
        sx={{ my: 5, fontSize: "1.5em" }}
        component="p"
        variant="subtitle1"
      >
        {news.body1}
      </Typography>
      <Typography component="h2" variant="h3">
        {news.header}
      </Typography>
      {news.value ? (
        Object.keys(news.value).map((carat, inx) => {
          return (
            <div key={carat}>
              <Typography sx={{ mt: 5 }} component="h2" variant="h3">
                سعر{" "}
                {carat === "ounce"
                  ? `اوقية ${news.cur_name.base}`
                  : carat.indexOf("1k") > 0
                  ? ` سبيكة الذهب وزن 1كجم`
                  : carat.indexOf("ingot") > -1
                  ? ` سبيكة الذهب وزن ${carat.substring(5)} جرام`
                  :`${news.cur_name.base} عيار ${carat}`
                }{" "}
                في {news.cur_name.country} اليوم
              </Typography>
              <Typography
                sx={{ my: 5, fontSize: "1.5em" }}
                component="p"
                variant="subtitle1"
              >
                و{inx > 0 ? `${connect[Math.floor(Math.random() * 9)]} ` : ""}
                {vocs[Math.floor(Math.random() * 5)]}{" "}
                {carat === "ounce"
                  ? `سعر اوقية ${news.cur_name.base}`
                  : carat.indexOf("1k") > 0
                  ? `سعر سبيكة الذهب وزن 1كجم`
                  : carat.indexOf("ingot") > -1
                  ? `سعر سبيكة الذهب وزن ${carat.substring(5)}`
                  : `سعر جرام ال${news.cur_name.base} عيار ${carat}`}{" "}
                في {news.cur_name.country} اليوم {news.ar_date} عند{" "}
                {news.value[carat]} {news.cur_name.normal} للشراء مقابل {news.value[carat]+news.profit_margin} {news.cur_name.normal} للبيع بحسب متوسط سعر
                التنفيذ في الأسواق، مقابل سعر بيع معلن أمس{" "}
                {Math.round((news.close_value[carat]+news.profit_margin+Number.EPSILON)*100)/100} {news.cur_name.normal} عند الإغلاق
              </Typography>
            </div>
          );
        })
      ) : (
        <Typography
          sx={{ my: 5, fontSize: "1.5em" }}
          component="p"
          variant="subtitle1"
        >
          {news.body2}
        </Typography>
      )}
    </Box>
  );
};

export default NewsContent;
