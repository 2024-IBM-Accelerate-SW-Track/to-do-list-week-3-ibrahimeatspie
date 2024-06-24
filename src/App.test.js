import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("test that App component renders", () => {
  render(<App />, container);
});

test("test that new-item-button is a button", () => {
  render(<App />, container);
  const element = screen.getByTestId("new-item-button");
  expect(element.outerHTML.toLowerCase().includes("button")).toBe(true);
});

test("test that new-item-input is an input ", () => {
  render(<App />, container);
  const element = screen.getByTestId("new-item-input");
  expect(element.innerHTML.toLowerCase().includes("input")).toBe(true);
});

test("no duplicate task", () => {
  render(<App />, container);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";

  // Add the first task
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Attempt to add the duplicate task
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Check if the task was added only once
  const taskItems = screen.getAllByText(/History Test/i);
  expect(taskItems.length).toBe(1);
});

test("submit task with no due date", () => {
  render(<App />, container);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const addButton = screen.getByRole("button", { name: /Add/i });

  // Attempt to add a task without a due date
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.click(addButton);

  // Check that the task was not added
  const taskItems = screen.queryByText(/History Test/i);
  expect(taskItems).toBeNull();
});

test("submit task with no task name", () => {
  render(<App />, container);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";

  // Attempt to add a task without a name
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Check that the task was not added
  const taskItems = screen.queryByText(new RegExp(dueDate, "i"));
  expect(taskItems).toBeNull();
});

test("late tasks have different colors", () => {
  render(<App />, container);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023"; // Assume this date is in the past

  // Add the late task
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Check the color of the task card
  const taskCard = screen.getByTestId(/History Test/i);
  expect(taskCard.style.background).toBe("red");
});

test("delete task", () => {
  render(<App />, container);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";

  // Add the task
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Delete the task
  const deleteCheckbox = screen.getByRole("checkbox");
  fireEvent.click(deleteCheckbox);

  // Check that the task was deleted
  const taskItems = screen.queryByText(/History Test/i);
  expect(taskItems).toBeNull();
});
