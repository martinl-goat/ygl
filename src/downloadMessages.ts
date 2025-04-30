import { MessageRecord, NewMessageCallback } from "./types";

interface DownloadMessageArguments {
  url: string;
  noCache: boolean;
  emitMessageCallback: NewMessageCallback;
  doneCallback: () => void;
}

async function downloadMessages({
  url,
  noCache,
  emitMessageCallback,
  doneCallback,
}: DownloadMessageArguments) {
  const NL = "\n";
  let chunkBuffer = "";
  let messagesCount = 0;
  let messagesBuffer: MessageRecord[] = [];

  const emit = () => {
    console.log(
      "emitting message buffer with message count",
      messagesBuffer.length,
    );
    emitMessageCallback(messagesBuffer);
    messagesBuffer = [];
  };

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
        chunkBuffer = chunkBuffer + chunk;
        if (chunkBuffer.length > 0) {
          const messages = chunkBuffer.split(NL);
          while (messages.length > 1) {
            // trimEnd() should get rid of carriage returns, which the NDJSON spec allows
            const message = messages.shift()!.trimEnd();
            const parsedMessage: MessageRecord = JSON.parse(message);
            messagesBuffer.push(parsedMessage);
            messagesCount = messagesCount + 1;
            if (messagesCount < 100 || messagesBuffer.length >= 1024) {
              emit();
            }
          }
          chunkBuffer = messages[0];
        }
        console.log("processed chunk, messages:", messagesCount);
      }

      if (done) {
        emit(); // don't forget to emit any remaining messages
        console.log("last chunk processed, messages:", messagesCount);
        break;
      }
    }
  } catch (e) {
    console.log(`error during api call: ${e}`);
  }

  console.log("getLogs: done");
  doneCallback();
}

export { downloadMessages };
