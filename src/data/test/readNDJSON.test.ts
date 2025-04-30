import { expect, test, vi } from "vitest";
import { readNDJSON } from "../readNDJSON";

const testRead = async (
  readResults: Record<string, unknown>[],
  messages: Record<string, unknown>[][],
) => {
  let readCall = -1;
  const read = vi.fn(() => {
    readCall = readCall + 1;
    return readResults[readCall];
  });
  const emitMessageCallback = vi.fn();

  // @ts-expect-error because we're faking ReadableStreamDefaultReader
  await readNDJSON({ reader: { read }, emitMessageCallback });

  expect(read).toHaveBeenCalledTimes(readResults.length);
  expect(emitMessageCallback).toHaveBeenCalledTimes(messages.length);
  for (let i = 0; i < messages.length; i++) {
    expect(emitMessageCallback).toHaveBeenNthCalledWith(i + 1, messages[i]);
  }
};

test("readNDJSON - empty", async () => {
  await testRead([{ done: true, value: "" }], []);
});

test("readNDJSON - single message", async () => {
  await testRead(
    [{ done: true, value: '{"foo":"bar"}\n' }],
    [[{ foo: "bar" }]],
  );
});

test("readNDJSON - multiple messages", async () => {
  await testRead(
    [
      { done: false, value: '{"foo":"bar"}\n{"bar":"foo"}\n' },
      { done: true, value: '{"bar":"baz"}\n' },
    ],
    [[{ foo: "bar" }], [{ bar: "foo" }], [{ bar: "baz" }]],
  );
});

test("readNDJSON - cross chunks", async () => {
  await testRead(
    [
      { done: false, value: '{"foo":"bar"}\n{"bar' },
      { done: true, value: '":"baz"}\n' },
    ],
    [[{ foo: "bar" }], [{ bar: "baz" }]],
  );
});

test("readNDJSON - CR", async () => {
  await testRead(
    [{ done: true, value: '{"foo":"bar"}\r\n{"bar":"baz"}\r\n' }],
    [[{ foo: "bar" }], [{ bar: "baz" }]],
  );
});

test("readNDJSON - invalid json throws", async () => {
  await expect(async () => {
    await testRead([{ done: true, value: "{foo:bar}\n" }], []);
  }).rejects.toThrowError("invalid JSON");
});

test("readNDJSON - empty messages throw", async () => {
  await expect(async () => {
    await testRead(
      [{ done: true, value: '{"foo":"bar"}\n\n{"bar":"baz"}\n' }],
      [[{ foo: "bar" }], [{ bar: "baz" }]],
    );
  }).rejects.toThrowError("invalid JSON");
});
