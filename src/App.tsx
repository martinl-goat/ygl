import { useCallback, useState } from "react";
import "./App.css";
import { Messages } from "./Messages/Messages";
import { useMessages } from "./data/useMessages";

const defaultUrl = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";

function App() {
  const [url, setUrl] = useState(defaultUrl);
  const [noCache, setNoCache] = useState(true);
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
    <>
      <h1>You've 🐐 logs! </h1>
      <div className="card">
        <label>
          URL: <input value={url} onChange={onUrlChange} size={51} />
        </label>
        <label>
          No cache:
          <input type="checkbox" checked={noCache} onChange={onNoCacheChange} />
        </label>
        <button type="button" onClick={refresh} disabled={working}>
          Go!
        </button>
        {working && "Working"}
      </div>
      <Messages messages={data} />
    </>
  );
}

export { App };
