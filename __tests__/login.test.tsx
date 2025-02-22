/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/login/page";

describe("Login Page", () => {
  it("renders the sign-in message", () => {
    render(<Login />);
    expect(screen.getByText("Sign in to CCHTF")).toBeInTheDocument();
  });
});
