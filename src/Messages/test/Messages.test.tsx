import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Messages } from "../Messages";

test("Messages", async () => {
  const messages = [
    { _time: 1645993488542, foo: "bar" },
    { _time: 1645993588542, foo: "baz" },
  ];
  render(<Messages messages={messages} />);

  expect(screen.getAllByRole("row")).toHaveLength(3); // includes header
  expect(screen.getAllByRole("columnheader")).toHaveLength(3); // includes expand control
  expect(screen.getAllByRole("cell")).toHaveLength(6);

  expect(screen.getByText("2022-02-27T20:24:48.542Z")).toBeInTheDocument();
  expect(screen.getByText("2022-02-27T20:26:28.542Z")).toBeInTheDocument();
  expect(
    screen.getByText('{"_time":1645993488542,"foo":"bar"}'),
  ).toBeInTheDocument();
  expect(
    screen.getByText('{"_time":1645993588542,"foo":"baz"}'),
  ).toBeInTheDocument();

  // note that Paginator, Timeline, and Message are tested separately
});
