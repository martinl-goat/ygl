import { MessageRecord } from "../types";
import { readNDJSON } from "./readNDJSON";

interface DownloadMessageArguments {
  url: string;
  noCache: boolean;
  emitMessageCallback: (msg: MessageRecord[]) => void;
  doneCallback: () => void;
}

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
  doneCallback();
}

export { downloadMessages };
