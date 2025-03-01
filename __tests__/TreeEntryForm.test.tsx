/**
 * @jest-environment jsdom
 */

import React, { ReactNode } from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { treeIssues } from "@/app/newTreeForm/tree-form-data";
import TreeEntryForm from "@/app/newTreeForm/page";
import { ClerkProvider } from "@clerk/nextjs";
import mockRouter from "next-router-mock";

jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useUser: () => ({
    user: {
      primaryEmailAddress: "test@example.com",
      fullName: "Test User",
    },
    isSignedIn: true,
  }),
}));

jest.mock("mongoose", () => ({
  Types: {
    Decimal128: {
      fromString: jest.fn((value) => value), // Mock Decimal128.fromString
    },
  },
}));

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
    expect(screen.getByText(/Trunk DBH/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("type here...")).toHaveLength(2);
  });

  it("updates tree spec fields when user types", async () => {
    render(<TreeEntryForm />);

    const treeLat = screen.getByPlaceholderText(/input latitude/i) as HTMLInputElement;
    const treeLong = screen.getByPlaceholderText(/input longitude/i) as HTMLInputElement;
    const treeHeight = screen.getByLabelText(/Tree Height/i) as HTMLInputElement;
    const canopySpread = screen.getByLabelText(/Canopy Spread/i) as HTMLInputElement;
    const trunkDBH = screen.getByLabelText(/Trunk DBH/i) as HTMLInputElement;

    await userEvent.type(treeLat, "100");
    await userEvent.type(treeLong, "30");
    await userEvent.type(treeHeight, "20");
    await userEvent.type(canopySpread, "100");
    await userEvent.type(trunkDBH, "-2");

    expect(treeLat.value).toBe("100");
    expect(treeLong.value).toBe("30");
    expect(treeHeight.value).toBe("20");
    expect(canopySpread.value).toBe("100");
    expect(trunkDBH.value).toBe("-2");
  });

  it("renders tree health section", () => {
    render(<TreeEntryForm />);

    // Tree Health
    expect(screen.getByText(/How would you rate the overall tree health\?/i)).toBeInTheDocument();
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByRole("button", { name: `${i}` })).toBeInTheDocument();
    }
    expect(screen.getByText(/Identify issues present in your tree\./i)).toBeInTheDocument();
    treeIssues.forEach((issue) => {
      expect(screen.getByRole("button", { name: issue })).toBeInTheDocument();
      expect(screen.getByText(issue)).toBeInTheDocument();
      expect(screen.getByAltText(issue)).toBeInTheDocument();
    });
  });

  it("applies correct stylization for selected tree health buttons", async () => {
    render(<TreeEntryForm />);

    const button1 = screen.getByRole("button", { name: "1" });
    const button10 = screen.getByRole("button", { name: "10" });

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

    const button = screen.getByRole("button", { name: /Dead branches/i });

    expect(button).toHaveStyle("border-color: #FFFFFF");
    expect(screen.queryByTestId("icon-Dead branches")).not.toBeInTheDocument();

    await userEvent.click(button);

    expect(button).toHaveStyle("border-color: #DFED98");
    expect(screen.getByTestId("icon-Dead branches")).toBeInTheDocument();

    await userEvent.click(button);

    expect(button).toHaveStyle("border-color: #FFFFFF");
    expect(screen.queryByTestId("icon-Dead branches")).not.toBeInTheDocument();
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

  const mockUser = {
    primaryEmailAddress: "test@example.com",
  };

  const mockFormData = {
    treeLocation: ["37.7749", "-122.4194"], // Example GPS coordinates
    treeType: "Valley Oak",
    treeSpecs: {
      treeHeight: 20,
      canopySpread: 100,
      trunkDBH: "2.5",
    },
    treeHealth: 8,
    treeIssues: ["Dead branches"],
    fieldNotes: "Healthy tree with minor issues.",
  };
});
