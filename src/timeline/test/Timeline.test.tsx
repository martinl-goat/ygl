import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Timeline } from "../Timeline";
import { bucketFor } from "../utils";

test("Timeline: bucketFor", async () => {
  // day buckets
  expect(bucketFor("day", 0)).toBe("1970-01-01");
  expect(bucketFor("day", 1645993488542)).toBe("2022-02-27");

  // hour buckets (not exposed in the app, but might as well test the existing code)
  expect(bucketFor("hour", 0)).toBe("1970-01-01 00:00:00");
  expect(bucketFor("hour", 1645993488542)).toBe("2022-02-27 20:00:00");

  // invalid unit
  expect(() => {
    // @ts-expect-error unknown unit
    bucketFor("foo", 1645993488542);
  }).toThrowError();
});

test("Timeline", async () => {
  const messages = [
    { _time: 1645993488542, foo: "foo" },
    { _time: 1645993588542, foo: "bar" },
    { _time: 1645993688542, foo: "baz" },
    { _time: 1646993688542, foo: "foobar" },
    { _time: 1646993788542, foo: "barfoo" },
  ];
  render(<Timeline messages={messages} />);

  // counts (should narrow selection down a bit)
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.getByText("2")).toBeInTheDocument();

  // buckets
  expect(screen.getByText("2022-02-27")).toBeInTheDocument();
  expect(screen.getByText("2022-03-11")).toBeInTheDocument();

  // fill percentage
  expect(screen.getAllByTestId("fill")).toHaveLength(2);
  expect(screen.getAllByTestId("fill")[0]).toHaveStyle("height: 100%;");
  expect(screen.getAllByTestId("fill")[1]).toHaveStyle("height: 67%;");
});
