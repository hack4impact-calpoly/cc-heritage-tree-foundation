/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SignUpPage from "@/app/signup/page";
import userEvent from "@testing-library/user-event";
import { ClerkProvider, SignedOut } from "@clerk/clerk-react";

//mocks signup components, checks that all neccessary components are on the page
jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }) => <>{children}</>,
  SignedOut: ({ children }) => <>{children}</>,
  SignUp: () => (
    <div>
      <div>Create your account</div>
      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
    </div>
  ),
}));

describe("Signup page", () => {
  it("allows email and password input", async () => {
    render(<SignUpPage />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("renders the welcome message", () => {
    render(<SignUpPage />);
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });
});
