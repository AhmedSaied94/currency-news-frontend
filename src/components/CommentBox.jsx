import React from "react";
import { Avatar, Divider, Grid, Paper, IconButton } from "@mui/material";
import { connect } from "react-redux";
import theme from "../styles/Theme";
import { TiDelete } from "react-icons/ti";
import { deleteComment } from "../slices/News";
import { axiosFetchInstance } from "../Axios";
import { useCookies } from "react-cookie";
import Store from "../Store";
import { useSnackbar } from "notistack";

const imgLink = "https://picsum.photos/200";
const CommentBox = ({ comments, host, authedUser }) => {
  const [cookies] = useCookies(["currency_news"]);
  const { enqueueSnackbar } = useSnackbar();

  const deleteCom = async (id) => {
    const res = await axiosFetchInstance(cookies.tokens).post(
      "handle-comments/",
      JSON.stringify({ id, oper: "delete" })
    );
    Store.dispatch(deleteComment({ id }));
    enqueueSnackbar(res.data.success, {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };

  return (
    <div style={{ padding: 14 }} className="App">
      <h1>التعليقات</h1>
      <Paper style={{ padding: "40px 20px" }}>
        {comments.map((comment, inx) => {
          return (
            <div key={comment.id}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  <Avatar
                    alt="Remy Sharp"
                    src={`${host}${comment.userdata.profile_pic}` || ""}
                  />
                </Grid>
                <Grid
                  sx={{ position: "relative" }}
                  justifyContent="flex-end"
                  item
                  xs
                  zeroMinWidth
                >
                  <h4 style={{ margin: 0, textAlign: "right" }}>
                    {comment.userdata.fullname}
                  </h4>
                  <p style={{ textAlign: "right" }}>{comment.content}</p>
                  <p style={{ textAlign: "right", color: "gray" }}>
                    {comment.customDate}
                  </p>
                  {authedUser && authedUser.id === comment.user && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "0.1rem",
                        left: "0.1rem",
                      }}
                      onClick={() => {
                        deleteCom(comment.id).catch((err) => {
                          enqueueSnackbar(err.response.data, {
                            variant: "error",
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "center",
                            },
                          });
                        });
                      }}
                    >
                      <TiDelete />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
              {inx !== comments.length - 1 && (
                <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
              )}
            </div>
          );
        })}
      </Paper>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { host } = state.constants;
  const { authedUser } = state.user;
  return { host, authedUser };
};

export default connect(mapStateToProps)(CommentBox);
