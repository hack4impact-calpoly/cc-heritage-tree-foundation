/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from "@/app/adminDashboard/page";

jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useUser: () => ({
    user: {
      primaryEmailAddress: "test@example.com",
      fullName: "Test User",
      firstName: "User",
    },
    isSignedIn: true,
  }),
}));

describe("AdminDashboard", () => {
  it("renders the welcome message", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Welcome back, User!")).toBeInTheDocument();
  });

  it("renders the 'Trees Logged This Year' section", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Trees Logged This Year")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("% incr from December")).toBeInTheDocument();
  });

  it("renders the 'Trees in Poor Condition' table", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Trees in Poor Condition")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "#" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Species" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Condition" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Date Recorded" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Volunteer" })).toBeInTheDocument();
  });

  it("renders the 'Create new announcement' button", () => {
    render(<AdminDashboard />);
    expect(screen.getByRole("button", { name: /Create new announcement/i })).toBeInTheDocument();
  });

  it("renders image of the map", () => {
    render(<AdminDashboard />);
    const mapImage = screen.getByTestId("map_id");
    expect(mapImage).toBeInTheDocument();
  });
});
