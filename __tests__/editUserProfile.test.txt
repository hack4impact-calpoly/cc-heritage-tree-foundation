/**
 * @jest-environment jsdom
 */

jest.mock("@clerk/nextjs", () => ({
  ...jest.requireActual("@clerk/nextjs"),
  useUser: () => ({
    user: {
      id: "user_123",
      fullName: "Test User",
      primaryEmailAddress: {
        emailAddress: "janedoe123@gmail.com",
      },
    },
    isLoaded: true,
  }),
}));

import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EditUserProfile from "@/app/editUserProfile/page";
import userEvent from "@testing-library/user-event";

describe("editUserProfile", () => {
  it("renders the Edit User Profile text", () => {
    render(<EditUserProfile />);
    expect(screen.getByText("Edit User Profile")).toBeInTheDocument();
  });

  it("renders the profile section", () => {
    render(<EditUserProfile />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("retrieves input data correctly", async () => {
    render(<EditUserProfile />);

    // retrieve elements
    const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText("Phone Number") as HTMLInputElement;

    // simulate user input
    await userEvent.type(nameInput, "Jane Doe");
    await userEvent.type(emailInput, "janedoe123@gmail.com");
    await userEvent.type(phoneInput, "000-000-0000");

    // check inputted values
    expect(nameInput.value).toBe("Jane Doe");
    expect(emailInput.value).toBe("janedoe123@gmail.com");
    expect(phoneInput.value).toBe("000-000-0000");
  });

  it("renders image of the profile", () => {
    render(<EditUserProfile />);
    const pfpImage = screen.getByAltText("Profile Picture Not Appearing");
    expect(pfpImage).toBeInTheDocument();
    expect(pfpImage).toHaveAttribute("src", "/pfp.png");
  });
});
