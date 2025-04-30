import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useMessages } from "../useMessages";

// this is a very basic url-to-messages test for useMessages. see
// readNDJSON.test.ts for parsing tests details.

test("useMessages", async () => {
  const read = vi.fn(() => ({
    done: true,
    value: '{"foo":"bar"}\n{"bar":"foo"}\n',
  }));

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

  const { result, unmount } = renderHook(() => useMessages("mocked", false));

  expect(result.current.data).toEqual([]);
  await act(() => result.current.refresh());
  expect(result.current.data).toEqual([{ foo: "bar" }, { bar: "foo" }]);

  unmount();
  fetchMock.mockReset();
});
