import { useCallback } from "react";
import "./App.css";
import { Messages } from "./Messages";
import { useData } from "./useData";

// a super tiny example file i found online
// const defaultUrl =
// "https://gist.githubusercontent.com/rfmcnally/0a5a16e09374da7dd478ffbe6ba52503/raw/095e75121f31a8b7dc88aa89dbd637a944ce264a/ndjson-sample.json";

// the example file from cribl
const defaultUrl = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";

function App() {
  const { data, done, url, setUrl, setNeedsRefresh } = useData(defaultUrl);

  const onUrlChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setUrl(e.target.value);
    },
    [setUrl],
  );

  const goClick = useCallback(() => {
    setNeedsRefresh(true);
  }, [setNeedsRefresh]);

  console.log("App: rendering, data length", data.length, "done", done);

  return (
    <>
      <h1>You've 🐐 logs! </h1>
      <div className="card">
        <label>
          URL: <input value={url} onChange={onUrlChange} size={51} />
        </label>
        <button type="button" onClick={goClick} disabled={!done}>
          Go
        </button>
        {!done && "Working"}
      </div>
      <Messages messages={data} />
      {/* <p className="read-the-docs">And here be notes.</p> */}
    </>
  );
}

export { App };
