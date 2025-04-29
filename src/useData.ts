import { useCallback, useEffect, useState } from "react";
import { MessageRecord, NewMessageCallback } from "./types";

async function getLogs(
  url: string,
  emitMessageCallback: NewMessageCallback,
  doneCallback: () => void,
) {
  const NL = "\n";
  let messageBuffer = "";

  const noCache = true; // TODO: make this a debug option

  try {
    const response = await fetch(url, {
      cache: noCache ? "no-store" : "default",
    });
    if (response.body === null) {
      throw new Error("Invalid response");
    }
    const reader = response.body
      .pipeThrough(new TextDecoderStream("utf-8"))
      .getReader();

    while (true) {
      const { done, value: chunk } = await reader.read();

      // mdn isn't 100% clear on whether done = true guarantees value = undefined,
      // for our use case assume there could be data in the 'done' chunk
      if (chunk !== undefined) {
        messageBuffer = messageBuffer + chunk;
        if (messageBuffer.length > 0) {
          const messages = messageBuffer.split(NL);
          while (messages.length > 1) {
            // trimEnd() should get rid of carriage returns, which the NDJSON spec allows
            const message = messages.shift()!.trimEnd();
            const parsedMessage: MessageRecord = JSON.parse(message);
            emitMessageCallback(parsedMessage);
          }
          messageBuffer = messages[0];
        }
      }

      if (done) {
        console.log("was last chunk, done");
        break;
      }
    }
  } catch (e) {
    console.log(`error during api call: ${e}`);
  }

  console.log("getLogs: calling done callback");
  doneCallback();
}

interface UseDataResult {
  url: string;
  setUrl: (url: string) => void;
  setNeedsRefresh: (refresh: boolean) => void;
  data: MessageRecord[];
  done: boolean;
}

function useData(defaultUrl: string): UseDataResult {
  const [url, setUrl] = useState<string>(defaultUrl);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [done, setDone] = useState(true);

  const reset = useCallback(() => {
    setNeedsRefresh(false);
    setMessages([]);
    // setDone(true); // TODO: look into why this isn't working as expected
  }, []);

  // console.log("useData: rendering");

  useEffect(() => {
    console.log("useData: in effect with url:", url);

    if (needsRefresh) {
      console.log("useData: retrieving data");
      setDone(false);
      setNeedsRefresh(false);

      getLogs(
        url,
        (msg) => {
          setMessages((messages) => messages.concat(msg));
        },
        () => {
          setDone(true);
        },
      );
    }

    return () => {
      console.log("useData cleaning up, url is", url);
      reset();
    };
  }, [url, needsRefresh, reset]);

  return { data: messages, done, setNeedsRefresh, url, setUrl };
}

export { useData };
