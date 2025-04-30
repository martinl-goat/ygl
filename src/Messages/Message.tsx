import { useCallback, useState } from "react";
import { MessageRecord } from "../types";

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

  return (
    <>
      <tr data-expanded={expanded} data-rowtype="row">
        <td>
          <button type="button" onClick={onExpandClick}>
            {expanded ? "\u25BD" : "\u25B7"}
          </button>
        </td>
        <td>{timestamp}</td>
        <td>{JSON.stringify(message)}</td>
      </tr>
      {expanded && (
        <tr data-rowtype="expansion">
          <td />
          <td colSpan={2}>
            <pre>
              <code>{JSON.stringify(message, null, 2)}</code>
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}

export { Message };
