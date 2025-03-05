/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UserProfile from "@/app/userProfile/page";

describe("UserProfile", () => {
  it("renders the User Profile text", () => {
    render(<UserProfile />);
    expect(screen.getByText("User Profile")).toBeInTheDocument();
  });

  it("renders the profile section", () => {
    render(<UserProfile />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Roles")).toBeInTheDocument();

    // dummy values
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("janedoe123@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("000-000-0000")).toBeInTheDocument();
    expect(screen.getByText("Admin, Volunteer")).toBeInTheDocument();
  });

  it("renders the 'Trees in Poor Condition' table", () => {
    render(<UserProfile />);
    expect(screen.getByText("Trees Logged")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "#" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Species" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Date Recorded" })).toBeInTheDocument();
  });

  it("renders image of the profile", () => {
    render(<UserProfile />);
    const pfpImage = screen.getByAltText("Profile Picture Not Appearing");
    expect(pfpImage).toBeInTheDocument();
    expect(pfpImage).toHaveAttribute("src", "/pfp.png");
  });
  /*
  it("renders small image of the profile", () => {
    render(<UserProfile />);
    const pfpImageSmall = screen.getByAltText("Small Profile Picture Not Appearing");
    expect(pfpImageSmall).toBeInTheDocument();
    expect(pfpImageSmall).toHaveAttribute("src", "/pfp.png");
  });*/
});
