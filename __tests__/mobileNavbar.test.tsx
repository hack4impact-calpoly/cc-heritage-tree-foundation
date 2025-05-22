/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import "@testing-library/jest-dom";
import { ClerkProvider } from "@clerk/nextjs";
import React, { ReactNode } from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// mock `isMobile` import to simulate mobile view
jest.mock("react-device-detect", () => ({
  isMobile: true,
}));

jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useUser: () => ({
    user: {
      id: "test-user-id",
      primaryEmailAddress: "test@example.com",
      fullName: "Test User",
    },
    isLoaded: true,
    isSignedIn: true,
  }),
}));

describe("Navbar component", () => {
  const pushMock = jest.fn();
  const useRouterMock = require("next/navigation").useRouter;

  beforeEach(() => {
    useRouterMock.mockReturnValue({ push: pushMock });
  });

  test("renders the mobile navbar and opens the drawer", async () => {
    render(
      <ChakraProvider>
        <Navbar />
      </ChakraProvider>,
    );

    const menuButton = screen.getByLabelText("Open Navigation");

    // clicking the menu button to open the drawer
    fireEvent.click(menuButton);

    // Wait for the drawer to open and check its contents
    await waitFor(() => screen.getByText("Dashboard"));
    expect(screen.getByText("Tree Inventory")).toBeInTheDocument();
    expect(screen.getByText("Volunteers")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Map")).toBeInTheDocument();
  });

  test("navigates correctly when a nav item is clicked", async () => {
    render(
      <ChakraProvider>
        <ClerkProvider>
          <Navbar />
        </ClerkProvider>
      </ChakraProvider>,
    );

    // simulate opening the drawer
    fireEvent.click(screen.getByLabelText(/Open Navigation/i));

    // "Tree Inventory" button
    const treeInventoryButton = screen.getByText("Tree Inventory");
    fireEvent.click(treeInventoryButton);

    expect(pushMock).toHaveBeenCalledWith("/treeTable");
  });
});
