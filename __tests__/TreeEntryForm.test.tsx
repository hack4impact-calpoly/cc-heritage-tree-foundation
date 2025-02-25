/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TreeEntryForm from "@/app/newTreeForm/page";
import userEvent from "@testing-library/user-event";
import { treeIssues } from "@/app/newTreeForm/tree-form-data";

describe("TreeEntryForm", () => {
  it("renders tree type section", () => {
    render(<TreeEntryForm />);

    // Tree Type
    expect(screen.getByText(/Tree Type/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Valley Oak/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Coast Live Oak/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Blue Oak/i })).toBeInTheDocument();
  });

  it("applies correct stylization for selected tree type button", async () => {
    render(<TreeEntryForm />);

    const button1 = screen.getByRole("button", { name: /Valley Oak/i });
    const button2 = screen.getByRole("button", { name: /Coast Live Oak/i });

    expect(button1).not.toBeDisabled();
    expect(button1).toHaveStyle("background-color: #CFEFF9");
    expect(button2).not.toBeDisabled();
    expect(button2).toHaveStyle("background-color: #78C1DE");

    await userEvent.click(button1);

    expect(button1).toBeDisabled();
    expect(button1).toHaveStyle("background-color: #333333");
    expect(button2).not.toBeDisabled();
    expect(button2).toHaveStyle("background-color: #78C1DE");

    await userEvent.click(button2);

    expect(button1).not.toBeDisabled();
    expect(button1).toHaveStyle("background-color: #CFEFF9");
    expect(button2).toBeDisabled();
    expect(button2).toHaveStyle("background-color: #333333");
  });

  it("renders tree specs section", () => {
    render(<TreeEntryForm />);

    // Tree Specs
    expect(screen.getByText(/Tree Specs/i)).toBeInTheDocument();
    expect(screen.getByText(/Tree Height/i)).toBeInTheDocument();
    expect(screen.getByText(/Canopy Spread/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("input a number")).toHaveLength(2);
    expect(screen.getByLabelText(/Trunk DBH/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("type here...")).toHaveLength(2);
  });

  it("updates tree spec fields when user types", async () => {
    const treeHealth = screen.getByLabelText(/Tree Specs/i) as HTMLInputElement;
    const canopySpread = screen.getByLabelText(/Canopy Spread/i) as HTMLInputElement;
    const trunkDBH = screen.getByLabelText(/Trunk DBH/i) as HTMLInputElement;

    await userEvent.type(treeHealth, "20");
    await userEvent.type(canopySpread, "100");
    await userEvent.type(trunkDBH, "-2");

    expect(treeHealth.value).toBe("20");
    expect(canopySpread.value).toBe("100");
    expect(trunkDBH.value).toBe("-2");
  });

  it("renders tree health section", () => {
    render(<TreeEntryForm />);

    // Tree Health
    expect(screen.getByLabelText(/How would you rate the overall tree health\?/i)).toBeInTheDocument();
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByRole("button", { name: `${i}` })).toBeInTheDocument();
    }
    expect(screen.getByLabelText(/Identify issues present in your tree\./i)).toBeInTheDocument();
    treeIssues.forEach((issue) => {
      expect(screen.getByRole("button", { name: issue })).toBeInTheDocument();
      expect(screen.getByText(issue)).toBeInTheDocument();
      expect(screen.getByAltText(issue)).toBeInTheDocument();
    });
  });

  it("applies correct stylization for selected tree health buttons", async () => {
    render(<TreeEntryForm />);

    const button1 = screen.getByRole("button", { name: /1/ });
    const button10 = screen.getByRole("button", { name: /10/ });

    expect(button1).not.toBeDisabled();
    expect(button1).toHaveStyle("background-color: #A41D00");
    expect(button10).not.toBeDisabled();
    expect(button10).toHaveStyle("background-color: #596334");

    await userEvent.click(button1);

    expect(button1).toBeDisabled();
    expect(button1).toHaveStyle("background-color: #333333");
    expect(button10).not.toBeDisabled();
    expect(button10).toHaveStyle("background-color: #596334");

    await userEvent.click(button10);

    expect(button1).not.toBeDisabled();
    expect(button1).toHaveStyle("background-color: #A41D00");
    expect(button10).toBeDisabled();
    expect(button10).toHaveStyle("background-color: #333333");
  });

  it("applies correct stylization for selected tree issue buttons", async () => {
    render(<TreeEntryForm />);

    const button = screen.getByRole("button", { name: /Dead Branches/i });

    expect(button).toHaveStyle("border-color: #FFFFFF");

    await userEvent.click(button);

    expect(button).toHaveStyle("border-color: #DFED98");
    expect(screen.getByTestId("icon-Dead Branches")).toBeInTheDocument();

    await userEvent.click(button);

    expect(button).toHaveStyle("border-color: #FFFFFF");
    expect(screen.getByTestId("icon-Dead Branches")).not.toBeInTheDocument();
  });

  it("renders field notes section", () => {
    render(<TreeEntryForm />);

    expect(screen.getByText(/Field notes/i));
    expect(screen.getByTestId("icon-Field notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Any additional observations or thoughts?"));
  });

  it("updates field notes when user types", async () => {
    render(<TreeEntryForm />);

    const fieldNotes = screen.getByLabelText("Any additional observations or thoughts?") as HTMLTextAreaElement;

    await userEvent.type(fieldNotes, "None.");

    expect(fieldNotes.value).toBe("None.");
  });

  it("renders submit button", () => {
    render(<TreeEntryForm />);

    expect(screen.getByRole("button", { name: /Submit/i }));
  });
});
