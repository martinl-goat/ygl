import { useCallback, useState } from "react";
import classes from "./App.module.css";
import { Messages } from "./messages/Messages";
import { useMessages } from "./data/useMessages";

const defaultUrl = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";

/**
 * Main app component that ties everything together. Includes url input field and
 * options, and messages output (table, timeline, ...). See components in `data` and
 * `messages` for details.
 */
function App() {
  const [url, setUrl] = useState(defaultUrl);
  const [noCache, setNoCache] = useState(true);

  // useMessages takes care of data fetching and parsing. data will be updated
  // as parsing progresses.
  const { data, working, refresh } = useMessages(url, noCache);

  const onUrlChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (evt) => {
      setUrl(evt.target.value);
    },
    [],
  );

  const onNoCacheChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((evt) => {
    setNoCache(evt.target.checked);
  }, []);

  console.log("App: rendering, data length", data.length, "working", working);

  return (
    <div className={classes.app}>
      <h1>You've 🐐 logs!</h1>
      <div className={classes.controls}>
        <label>
          URL:{" "}
          <input
            value={url}
            onChange={onUrlChange}
            size={51}
            className={classes.urlInput}
          />
        </label>
        <label>
          No cache:
          <input type="checkbox" checked={noCache} onChange={onNoCacheChange} />
        </label>
        <button type="button" onClick={refresh} disabled={working}>
          Go!
        </button>
        {working && "Working…"}
      </div>
      <Messages messages={data} />
    </div>
  );
}

export { App };
