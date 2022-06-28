import React, { useRef, useState, useEffect } from 'react';
import script from 'scriptjs';

const TwitterTweet = (props) => {

  const ref = useRef(null);
  const [loading, setLoading] = useState(true);
  let methodName$5 = 'createTweet';
  let twitterWidgetJs = 'https://platform.twitter.com/widgets.js';

  useEffect(function () {
    var isComponentMounted = true;

    script(twitterWidgetJs, 'twitter-embed', function () {
      if (!window.twttr) {
        console.error('Failure to load window.twttr, aborting load');
        return;
      }

      if (isComponentMounted) {
        if (!window.twttr.widgets[methodName$5]) {
          console.error(`Method ${methodName$5} is not present anymore in twttr.widget api`);
          return;
        }

        window.twttr.widgets[methodName$5](props.tweetId, ref === null || ref === void 0 ? void 0 : ref.current, props.options).then(function (element) {
          setLoading(false);

          if (props.onLoad) {
            props.onLoad(element);
          }
        });
      }
    });
    return function () {
      isComponentMounted = false;
    };
  }, []);
  return React.createElement(React.Fragment, null, loading && React.createElement(React.Fragment, null, props.placeholder), React.createElement("div", {
    ref: ref
  }));
};

export default TwitterTweet;
