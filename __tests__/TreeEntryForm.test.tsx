/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TreeEntryForm from "@/app/newTreeForm/page";
import userEvent from "@testing-library/user-event";

describe("TreeEntryForm", () => {
  it("renders the form correctly", () => {
    render(<TreeEntryForm />);

    // getting elements
    expect(screen.getByPlaceholderText("Tree Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Species")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Location")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    render(<TreeEntryForm />);

    // getting elements
    const treeNameInput = screen.getByPlaceholderText("Tree Name") as HTMLInputElement;
    const speciesInput = screen.getByPlaceholderText("Species") as HTMLInputElement;
    const locationInput = screen.getByPlaceholderText("Location") as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText("Description") as HTMLTextAreaElement;

    // simulating user input
    await userEvent.type(treeNameInput, "Oak");
    await userEvent.type(speciesInput, "Quercus robur");
    await userEvent.type(locationInput, "Central Park");
    await userEvent.type(descriptionInput, "A majestic oak tree.");

    // checking that the inputted values are what are displayed
    expect(treeNameInput.value).toBe("Oak");
    expect(speciesInput.value).toBe("Quercus robur");
    expect(locationInput.value).toBe("Central Park");
    expect(descriptionInput.value).toBe("A majestic oak tree.");
  });

  it("updates the file input when a file is selected", async () => {
    render(<TreeEntryForm />);

    const fileInput = screen.getByRole("button", { name: /submit/i }).previousSibling as HTMLInputElement;
    const file = new File(["tree"], "tree.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(fileInput.files).toHaveLength(1);
      expect(fileInput.files![0].name).toBe("tree.png");
    });
  });

  it("submits the form and displays the submitted data", async () => {
    render(<TreeEntryForm />);

    // get html elements
    const treeNameInput = screen.getByPlaceholderText("Tree Name") as HTMLInputElement;
    const speciesInput = screen.getByPlaceholderText("Species") as HTMLInputElement;
    const locationInput = screen.getByPlaceholderText("Location") as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText("Description") as HTMLTextAreaElement;
    const conditionSelect = screen.getByRole("combobox") as HTMLSelectElement;
    const fileInput = screen.getByRole("button", { name: /submit/i }).previousSibling as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // simulating user input
    await userEvent.type(treeNameInput, "Oak");
    await userEvent.type(speciesInput, "Quercus robur");
    await userEvent.type(locationInput, "Central Park");
    await userEvent.type(descriptionInput, "A majestic oak tree.");
    await userEvent.selectOptions(conditionSelect, "Healthy");

    const file = new File(["tree"], "tree.png", { type: "image/png" });
    await userEvent.upload(fileInput, file);

    await userEvent.click(submitButton);

    // awaiting display of submitted data after clicking submit
    await waitFor(() => {
      expect(screen.getByText("Submitted Data")).toBeInTheDocument();
      expect(screen.getByText("Tree Name: Oak")).toBeInTheDocument();
      expect(screen.getByText("Species: Quercus robur")).toBeInTheDocument();
      expect(screen.getByText("Location: Central Park")).toBeInTheDocument();
      expect(screen.getByText("Description: A majestic oak tree.")).toBeInTheDocument();
      expect(screen.getByText("Condition: Healthy")).toBeInTheDocument();
      expect(screen.getByText("Photo: tree.png")).toBeInTheDocument();
    });
  });
});
