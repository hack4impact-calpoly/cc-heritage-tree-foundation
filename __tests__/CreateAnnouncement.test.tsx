/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateAnnouncement from "@/app/createAnnouncement/page";
import { act } from "react";

jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,

  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: "user_123",
      fullName: "Test User",
      primaryEmailAddress: { emailAddress: "test@example.com" },
    },
  }),

  useAuth: () => ({
    getToken: () => Promise.resolve("mock-token"),
    userId: "user_123",
    sessionId: "sess_abc",
    isSignedIn: true,
  }),
}));

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ name: "Test User", email: "test@example.com", role: "admin" }]),
    }),
  ) as jest.Mock;
});

describe("CreateAnnouncement", () => {
  it("renders the form correctly", async () => {
    await act(async () => {
      render(<CreateAnnouncement />);
    });

    expect(screen.getByText("New Message")).toBeInTheDocument();
    expect(screen.getByText("Send to")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    await act(async () => {
      render(<CreateAnnouncement />);
    });

    const subjectInput = screen.getByPlaceholderText("Subject line here") as HTMLInputElement;
    const messageInput = screen.getByPlaceholderText("Type your message here...") as HTMLTextAreaElement;

    await userEvent.type(subjectInput, "Meeting Update");
    await userEvent.type(messageInput, "Hello everyone, please note the meeting time change.");

    expect(subjectInput.value).toBe("Meeting Update");
    expect(messageInput.value).toBe("Hello everyone, please note the meeting time change.");
  });

  it("handles file selection correctly", async () => {
    await act(async () => {
      render(<CreateAnnouncement />);
    });

    const fileInput = screen.getByTestId("file-upload");

    const file = new File(["sample content"], "sample.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const attachmentText = screen.getByText("sample.txt");
    expect(attachmentText).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    await act(async () => {
      render(<CreateAnnouncement />);
    });

    const sendToAllButton = screen.getByRole("button", { name: "Send to All" });
    await act(async () => {
      fireEvent.click(sendToAllButton);
    });

    const subjectInput = screen.getByPlaceholderText(/Subject line here/i);
    const messageTextarea = screen.getByPlaceholderText(/Type your message here/i);

    await act(async () => {
      fireEvent.change(subjectInput, { target: { value: "Test Subject" } });
      fireEvent.change(messageTextarea, { target: { value: "Test Message" } });
    });

    const submitButton = screen.getByRole("button", { name: /^Send$/ });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(
        "Submitted Data: ",
        expect.objectContaining({
          subject: "Test Subject",
          message: "Test Message",
          attachment: null,
        }),
      );
    });

    logSpy.mockRestore();
  });
});
