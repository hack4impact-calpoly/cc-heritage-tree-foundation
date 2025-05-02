import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "@/app/adminDashboard/page";
import mockRouter from "next-router-mock";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            species: "Oak",
            condition: "Poor",
            recordedAt: "2024-05-01",
            volunteer: "John Doe",
            gpsCoordinates: [37.7749, -122.4194],
            treeCondition: ["x", "y"],
            dbh: 14,
            height: 20,
            canopyBreadth: 12,
          },
        ]),
    }),
  ) as jest.Mock;
});

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

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("AdminDashboard", () => {
  it("renders the welcome message", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Welcome back, User!")).toBeInTheDocument();
    });
  });

  it("renders the 'Trees Logged This Year' section", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Trees Logged This Year")).toBeInTheDocument();
    });
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("% incr from December")).toBeInTheDocument();
  });

  it("renders the 'Trees in Poor Condition' table", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Trees in Poor Condition")).toBeInTheDocument();
    });
    expect(screen.getByRole("columnheader", { name: "#" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Species" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Condition" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Date Recorded" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Volunteer" })).toBeInTheDocument();
  });

  it("renders the 'Create new announcement' button", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Create new announcement/i })).toBeInTheDocument();
    });
  });

  it("renders image of the map", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      const mapImage = screen.getByTestId("map_id");
      expect(mapImage).toBeInTheDocument();
    });
  });
});
