import { useCallback, useState } from "react";
import { MessageRecord } from "./types";

interface MessageProps {
  message: MessageRecord;
}

function Message({ message }: MessageProps) {
  const [expanded, setExpanded] = useState(false);

  const onExpandClick = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const timestamp =
    typeof message._time === "number"
      ? new Date(message._time).toISOString()
      : "<n/a>";

  // TODO: think about doing this once vs every time (memory cost vs performance)
  // TODO: also, it might make more sense to not even parse JSON in the api call but instead
  //   pass string data around
  const json = JSON.stringify(message);
  const jsonPretty = JSON.stringify(message, null, 2);

  return (
    <>
      <tr>
        <td>
          <button type="button" onClick={onExpandClick}>
            {expanded ? "\u25BD" : "\u25B7"}
          </button>
        </td>
        <td>{timestamp}</td>
        <td>{json}</td>
      </tr>
      {expanded && (
        <tr>
          <td />
          <td colSpan={2}>{jsonPretty}</td>
        </tr>
      )}
    </>
  );
}

export { Message };
