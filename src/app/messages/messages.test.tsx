/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Messages from "./page";
import "@testing-library/jest-dom";

// added this so it doesnt crash during test
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Messages Component", () => {
  // checks to see if the header shows ups
  it("renders the Messages header", () => {
    render(<Messages />);
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  // checks to see if 7 messages are shown on a page
  it("renders 7 messages per page", () => {
    render(<Messages />);
    const messageRows = screen.getAllByRole("row");
    expect(messageRows.length).toBeGreaterThanOrEqual(8); /*1 header + 7 rows = 8 */
  });

  // checks to see if clicking next moves to page 2
  it("navigates to next page", () => {
    render(<Messages />);
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(screen.getByText("2")).toHaveClass("activePage");
  });
});
