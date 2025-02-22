/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Login from "@/app/login/page";
import { SignIn } from "@app/signin/page";
import userEvent from "@testing-library/user-event";

jest.mock("@clerk/nextjs", () => ({
  //mocks the clerk provider, takes the children and outputs the children
  ClerkProvider: ({ children }) => <>{children}</>,

  //mocks the login component, it is just two divs
  //two input boxes. This should catch if sign in component is forgotten
  SignIn: () => (
    <div>
      <div>Sign in to CCHTF</div>
      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
    </div>
  ),
  //mocks the signed out component
  SignedOut: ({ children }) => <>{children}</>,
}));

describe("Login Page", () => {
  it("allows email and password input", async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("renders the welcome message", () => {
    render(<Login />);
    expect(screen.getByText("Sign in to CCHTF")).toBeInTheDocument();
  });
});
