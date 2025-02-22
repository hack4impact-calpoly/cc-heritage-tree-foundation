/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/login/page";
import { usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

describe("Login Page", () => {
  it("renders the welcome message", () => {
    render(<Login />);
    expect(screen.getByText("Sign in to CCHTF")).toBeInTheDocument();
  });
});
