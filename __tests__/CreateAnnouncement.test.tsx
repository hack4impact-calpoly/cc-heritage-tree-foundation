/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateAnnouncement from "@/app/createAnnouncement/page";

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

describe("CreateAnnouncement", () => {
  it("renders the form correctly", () => {
    render(<CreateAnnouncement />);

    expect(screen.getByText("New Message")).toBeInTheDocument();
    expect(screen.getByLabelText("Send to")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    render(<CreateAnnouncement />);

    const recipientsInput = screen.getByPlaceholderText("Find recipients") as HTMLInputElement;
    const subjectInput = screen.getByPlaceholderText("Subject line here") as HTMLInputElement;
    const messageInput = screen.getByPlaceholderText("Type your message here...") as HTMLTextAreaElement;

    await userEvent.type(recipientsInput, "testUser");
    await userEvent.type(subjectInput, "Meeting Update");
    await userEvent.type(messageInput, "Hello everyone, please note the meeting time change.");

    expect(recipientsInput.value).toBe("testUser");
    expect(subjectInput.value).toBe("Meeting Update");
    expect(messageInput.value).toBe("Hello everyone, please note the meeting time change.");
  });

  it("handles file selection correctly", () => {
    render(<CreateAnnouncement />);

    const fileInput = screen.getByLabelText(/Add attachment/i);
    const file = new File(["sample content"], "sample.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check if the file name appears correctly
    const attachmentText = screen.getByText("sample.txt");
    expect(attachmentText).toBeInTheDocument();
  });

  it("handles form submission correctly", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    // Render the component
    render(<CreateAnnouncement />);

    const recipientsInput = screen.getByPlaceholderText(/Find recipients/i);
    const subjectInput = screen.getByPlaceholderText(/Subject line here/i);
    const messageTextarea = screen.getByPlaceholderText(/Type your message here/i);

    fireEvent.change(recipientsInput, { target: { value: "Test User" } });
    fireEvent.change(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.change(messageTextarea, { target: { value: "Test Message" } });

    // Simulate form submission
    const submitButton = screen.getByRole("button", { name: /Send/i });
    fireEvent.click(submitButton);

    // Check if console.log was called with the correct form data
    expect(logSpy).toHaveBeenCalledWith("Submitted Data: ", {
      recipients: "Test User",
      subject: "Test Subject",
      message: "Test Message",
      attachment: null,
    });

    logSpy.mockRestore();
  });
});
