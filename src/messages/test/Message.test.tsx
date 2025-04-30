import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { Message } from "../Message";

test("Message", async () => {
  const message = { _time: 1645993488542, foo: "bar" };
  render(<Message message={message} />);

  // message content
  expect(screen.getByText("2022-02-27T20:24:48.542Z")).toBeInTheDocument();
  expect(
    screen.getByText('{"_time":1645993488542,"foo":"bar"}'),
  ).toBeInTheDocument();

  // expand
  expect(screen.getByRole("button")).toHaveTextContent("▷");
  await userEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("button")).toHaveTextContent("▽");

  // expansion content
  expect(screen.getByRole("code")).toHaveTextContent(
    '{ "_time": 1645993488542, "foo": "bar" }', // TODO: verify multi-line correctly
  );

  // close
  await userEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("button")).toHaveTextContent("▷");
  expect(screen.queryByRole("code")).not.toBeInTheDocument();
});
