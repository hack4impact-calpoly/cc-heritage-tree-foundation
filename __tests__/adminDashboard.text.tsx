/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from "@/app/adminDashboard/page";

describe("AdminDashboard", () => {
  it("renders the welcome message", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Welcome back, Jane!")).toBeInTheDocument();
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

    const button = screen.getByRole("button", { name: /Create new announcement/i });
    expect(button).toBeInTheDocument();
  });

  it("renders image of the map", () => {
    render(<AdminDashboard />);

    const mapImage = screen.getByAltText("Map not Appearing");
    expect(mapImage).toBeInTheDocument();
    expect(mapImage).toHaveAttribute("src", "/map.png");
  });
});
