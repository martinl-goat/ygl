import { MessageRecord } from "../types";

interface ReadNDJSONArguments {
  reader: ReadableStreamDefaultReader;
  emitMessageCallback: (msg: MessageRecord[]) => void;
}

async function readNDJSON({
  reader,
  emitMessageCallback,
}: ReadNDJSONArguments) {
  const NL = "\n";
  let chunkBuffer = "";
  let messagesCount = 0;
  let messagesBuffer: MessageRecord[] = [];

  const emit = () => {
    if (messagesBuffer.length > 0) {
      console.log(
        "emitting message buffer with message count",
        messagesBuffer.length,
      );
      emitMessageCallback(messagesBuffer);
      messagesBuffer = [];
    }
  };

  while (true) {
    const { done, value: chunk } = await reader.read();

    // mdn isn't 100% clear on whether done = true guarantees value = undefined,
    // for our use case assume there could be data in the 'done' chunk
    if (chunk !== undefined) {
      chunkBuffer = chunkBuffer + chunk;
      if (chunkBuffer.length > 0) {
        const messages = chunkBuffer.split(NL);
        while (messages.length > 1) {
          // trimEnd() should get rid of carriage returns, which the NDJSON spec allows,
          // though it seems JSON.parse doesn't care about it anyway, look into it
          const message = messages.shift()!.trimEnd();
          try {
            const parsedMessage: MessageRecord = JSON.parse(message);
            messagesBuffer.push(parsedMessage);
            messagesCount = messagesCount + 1;
            if (messagesCount < 100 || messagesBuffer.length >= 1024) {
              emit();
            }
          } catch (e) {
            // spec: "If the JSON text is not parsable, the parser SHOULD raise an error."
            throw new Error(`Encountered invalid JSON during parsing: ${e}`);
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
}

export { readNDJSON };
