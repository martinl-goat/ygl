import { MessageRecord } from "../types";
import { readNDJSON } from "./readNDJSON";

interface DownloadMessageArguments {
  url: string;
  noCache: boolean;
  emitMessageCallback: (msg: MessageRecord[]) => void;
  doneCallback: () => void;
}

/**
 * Retrieves NDJSON content and calls `emitMessageCallback` multiple times, with an array of
 * parsed messages. See `readNDJSON` for parsing details.
 * @param url - The URL to download data from.
 * @param noCache - If `true`, `fetch` is told to skip the cache.
 * @param emitMessageCallback - Called with an array of parsed messages (multiple times if needed).
 * @param doneCallback – Called upon completion.
 */
async function downloadMessages({
  url,
  noCache,
  emitMessageCallback,
  doneCallback,
}: DownloadMessageArguments) {
  try {
    const response = await fetch(url, {
      cache: noCache ? "no-store" : "default",
    });
    if (response.body === null) {
      throw new Error("Invalid response");
    }

    // spec: "All serialized data MUST use the UTF8 encoding."
    const reader = response.body
      .pipeThrough(new TextDecoderStream("utf-8"))
      .getReader();

    await readNDJSON({ reader, emitMessageCallback });
  } catch (e) {
    console.log(`error during api call: ${e}`);
  }

  console.log("getLogs: done");
  doneCallback(); // TODO: remove this, it's unnecessary
}

export { downloadMessages };
