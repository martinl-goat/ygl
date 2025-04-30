import { expect, test, vi } from "vitest";
import { downloadMessages } from "../downloadMessages";

// note that this is just a simple test for the download
// helper, see readNDJSON.test.ts for parsing tests

test("downloadMessages", async () => {
  const read = vi.fn(() => ({
    done: true,
    value: '{"foo":"bar"}\n{"bar":"foo"}\n',
  }));
  const emitMessageCallback = vi.fn();
  const doneCallback = vi.fn();

  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    // @ts-expect-error because we're faking Response
    .mockImplementation(async () => ({
      body: {
        pipeThrough: () => ({
          getReader: () => ({ read }),
        }),
      },
    }));

  await downloadMessages({
    url: "mocked",
    noCache: false,
    emitMessageCallback,
    doneCallback,
  });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(read).toHaveBeenCalledTimes(1);
  expect(doneCallback).toHaveBeenCalledTimes(1);
  expect(emitMessageCallback).toHaveBeenCalledTimes(2);

  fetchMock.mockReset();
});
