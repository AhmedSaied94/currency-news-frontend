import React from "react";
import { Box } from "@mui/material";
import TwitterTweet from './TwitterTweet'
const Tweets = ({ tweets }) => {
  return (
    <Box>
      {tweets.map((tweet) => {
        return (
          <Box key={tweet.id} sx={{ my: 2 }}>
            <TwitterTweet
              options={{
                cards: "hidden",
                conversation: "none",
                lang: "en",
              }}
              tweetId={tweet.id}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default Tweets;
