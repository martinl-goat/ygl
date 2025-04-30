import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Paginator } from "../Paginator";

test("Paginator", async () => {
  const setCurrentPage = vi.fn();

  render(
    <Paginator
      currentPage={2}
      pageSize={25}
      messagesCount={110}
      setCurrentPage={setCurrentPage}
    />,
  );

  expect(screen.getByTestId("first")).toBeInTheDocument();
  expect(screen.getByTestId("previous")).toBeInTheDocument();
  expect(screen.getByTestId("next")).toBeInTheDocument();
  expect(screen.getByTestId("last")).toBeInTheDocument();

  expect(screen.getByTestId("position").textContent).toBe("3 / 5");
  expect(screen.getByTestId("total").textContent).toBe("Total messages: 110");

  await userEvent.click(screen.getByTestId("first"));
  expect(setCurrentPage).toHaveBeenCalledTimes(1);

  await userEvent.click(screen.getByTestId("previous"));
  expect(setCurrentPage).toHaveBeenCalledTimes(2);

  await userEvent.click(screen.getByTestId("next"));
  expect(setCurrentPage).toHaveBeenCalledTimes(3);

  await userEvent.click(screen.getByTestId("last"));
  expect(setCurrentPage).toHaveBeenCalledTimes(4);
});
