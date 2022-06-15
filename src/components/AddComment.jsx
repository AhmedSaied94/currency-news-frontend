import React from "react";
import { TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/material";
import theme from "../styles/Theme";
import { useCookies } from "react-cookie";
import { axiosFetchInstance } from "../Axios";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import Store from "../Store";
import { createComment } from "../slices/News";

const AddComment = ({ newsId, authedUser }) => {
  const [content, setContent] = React.useState("");
  const [cookies] = useCookies(["currency_news"]);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const addComment = async () => {
    setLoading(true);
    if (content === "") {
      enqueueSnackbar("comment can't be empty", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      setLoading(false);
      return;
    }
    const data = {
      content,
      news: newsId,
      oper: "create",
    };
    const res = await axiosFetchInstance(cookies.tokens).post(
      "handle-comments/",
      JSON.stringify(data)
    );
    Store.dispatch(createComment({ comment: res.data }));
    enqueueSnackbar("comment added successfully", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
    setContent("");
    setLoading(false);
  };
  return (
    <>
      {authedUser && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: "14px",
          }}
        >
          <TextField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            multiline
            minRows={4}
            color="grey"
            fullWidth
          />
          <LoadingButton
            loading={loading}
            onClick={() => {
              addComment().catch((err) => {
                setLoading(false);
                console.log(err);
                enqueueSnackbar(err.response.data, {
                  variant: "error",
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                  },
                });
              });
            }}
            // size="large"
            variant="contained"
            sx={{
              color: "#fff",
              backgroundColor: "#000",
              borderRadius: 0.5,
              my: 2,
              "&:hover": {
                backgroundColor: "#000",
                opacity: 0.9,
              },
            }}
          >
            Add comment
          </LoadingButton>
        </Box>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { authedUser } = state.user;
  return { authedUser };
};

export default connect(mapStateToProps, { createComment })(AddComment);
