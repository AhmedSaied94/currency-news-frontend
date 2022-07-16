import * as React from "react";
import QueryString from "query-string";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import Store from "../Store";
import { setNews, newsLike, newsUnlike } from "../slices/News";
import { Grid } from "@mui/material";
import NewsContent from "../components/NewsContent";
import { axiosFetchInstance } from "../Axios";
import { useCookies } from "react-cookie";
import NewsShare from "../components/NewsShare";
import theme from "../styles/Theme";
import { Box } from "@mui/material";
import { Typography, IconButton, Chip } from "@mui/material";
import CommentBox from "../components/CommentBox";
import AddComment from "../components/AddComment";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { like, unLike } from "../slices/AuthedUser";
import { authInfo } from "../slices/Constants";
const News = ({ news, authedUser }) => {
  const location = useLocation();
  const [cookies] = useCookies(["currency_news"]);

  const fillLike = async (newsid) => {
    const res = await axiosFetchInstance(cookies.tokens).post(
      "handle-likes/",
      JSON.stringify({ id: newsid, oper: "unlike" })
    );
    Store.dispatch(unLike({ id: newsid }));
    Store.dispatch(newsUnlike());
  };

  const outLike = async (newsid) => {
    console.log(authedUser);
    if (!authedUser) {
      Store.dispatch(authInfo({ com: "login", state: "open" }));
      return;
    }
    const res = await axiosFetchInstance(cookies.tokens).post(
      "handle-likes/",
      JSON.stringify({ id: newsid, oper: "like" })
    );
    Store.dispatch(like({ id: newsid }));
    Store.dispatch(newsLike());
  };

  React.useEffect(() => {
    const fetchNews = async () => {
      const arr = location.pathname.split("/");
      const res = await axiosFetchInstance(cookies.tokens).get(
        `news-details/news/${arr[arr.length - 2]}/${arr[arr.length - 1]}/`
      );
      Store.dispatch(setNews({ news: res.data }));
    };

    fetchNews();
    return () => Store.dispatch(setNews({ news: null }));
  }, [location]);

  return (
    <>
      {news && (
        <Grid sx={{ my: 7, direction: "rtl" }} container spacing={2}>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              maxHeight: "100vh",
            }}
            item
            xs={12}
            md={1}
          >
            <Box
              sx={{
                display: "flex",
                justifySelf: "baseline",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxHeight: 40,
              }}
            >
              <IconButton
                onClick={() => {
                  authedUser && authedUser.likes.includes(news.id)
                    ? fillLike(news.id)
                    : outLike(news.id);
                }}
              >
                {authedUser && authedUser.likes.includes(news.id) ? (
                  <AiFillLike />
                ) : (
                  <AiOutlineLike />
                )}
              </IconButton>
              <Chip
                sx={{
                  borderRadius: "5px",
                  backgroundColor: theme.palette.grey.light,
                  fontWeight: 500,
                  fontSize: "0.8em",
                  color: theme.palette.grey.dark,
                }}
                size="small"
                label={news.likes || 0}
              />
            </Box>
            <NewsShare news={news} />
          </Grid>
          <Grid item xs={12} md={8}>
            <NewsContent news={news} />
            <CommentBox comments={news.comments} />
            <AddComment newsId={news.id} />
          </Grid>
          <Grid sx={{ p: 2 }} item xs={12} md={3}>
            <Box
              sx={{
                height: 300,
                backgroundColor: theme.palette.grey.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 2,
              }}
            >
              <Typography textAlign="center" variant="h4">
                اعلان 1
              </Typography>
            </Box>
            <Box
              sx={{
                height: 300,
                backgroundColor: theme.palette.grey.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 2,
              }}
            >
              <Typography textAlign="center" variant="h4">
                اعلان 2
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { news } = state.news;
  const { authedUser } = state.user;
  return { news, authedUser };
};

export default connect(mapStateToProps, { setNews })(News);
