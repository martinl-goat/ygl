import { useEffect, useState } from "react";
import { MessageRecord } from "../types";
import { downloadMessages } from "./downloadMessages";

interface UseMessagesResult {
  data: MessageRecord[];
  working: boolean;
  refresh: () => void;
}

function useMessages(url: string, noCache: boolean): UseMessagesResult {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [working, setWorking] = useState(false);
  const [needsRefreshFrom, setNeedsRefreshFrom] = useState<string>();

  const reset = () => {
    setMessages([]);
    setWorking(false);
    setNeedsRefreshFrom(undefined);
  };

  const refresh = () => {
    reset();
    setNeedsRefreshFrom(url);
  };

  useEffect(() => {
    console.log("useMessages: in effect with url:", needsRefreshFrom);

    if (needsRefreshFrom !== undefined) {
      console.log("useMessages: retrieving data");
      setNeedsRefreshFrom(undefined);
      setWorking(true);

      downloadMessages({
        url: needsRefreshFrom,
        noCache,
        emitMessageCallback: (msg) => {
          // TODO: look into performance for (very) large arrays
          setMessages((messages) => messages.concat(msg));
        },
        doneCallback: () => {
          setWorking(false);
        },
      });
    }

    return () => {
      console.log("useMessages cleaning up, url", needsRefreshFrom);
      // TODO: implement a clean request/stream abort
    };
  }, [needsRefreshFrom, noCache]);

  return { data: messages, working, refresh };
}

export { useMessages };
