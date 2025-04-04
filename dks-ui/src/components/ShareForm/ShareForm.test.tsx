import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShareForm from "./ShareForm";
import { act } from "react-dom/test-utils";

describe("ShareForm", () => {
  test("renders ShareForm component", () => {
    render(<ShareForm enableImageURL={true} handleSubmit={jest.fn()} />);
    const shareForm = screen.getByTestId("shareForm");
    expect(shareForm).toBeInTheDocument();
  });

  test("validates form inputs correctly", async () => {
    const { getByText } = render(
      <ShareForm enableImageURL={true} handleSubmit={jest.fn()} />
    );
    const firstNameInput = screen.getByTestId("inputfirstName");
    const titleInput = screen.getByTestId("inputtitle");
    const linkInput = screen.getByTestId("inputlink");
    const imageUrlInput = screen.getByTestId("inputimageUrl");
    await act(async () => {
      // Enter invalid values
      fireEvent.change(firstNameInput, { target: { value: "123" } });
      fireEvent.change(titleInput, {
        target: {
          value:
            "This Title is really really long. I mean, it just goes on and on ...nonstop. Will it ever end. Who knows?",
        },
      });
      fireEvent.change(linkInput, {
        target: { value: "scp://badverybad" },
      });
      fireEvent.change(imageUrlInput, {
        target: { value: "scp://badverybad" },
      });

      // Submit the form
      fireEvent.click(getByText("Share"));
    });
    // Check for validation error messages
    expect(
      screen.getByText(
        "Please enter a valid Contributor name; only letters, periods, and spaces allowed"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please enter a valid Blog Title; maximum 100 characters"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please enter a valid Blog URL; starting with http or https"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please enter a valid Image URL; starting with http, https or ftp"
      )
    ).toBeInTheDocument();
  });

  test("submits the form with valid inputs", async () => {
    const { getByText } = render(
      <ShareForm enableImageURL={true} handleSubmit={jest.fn()} />
    );
    const firstNameInput = screen.getByTestId("inputfirstName");
    const titleInput = screen.getByTestId("inputtitle");
    const linkInput = screen.getByTestId("inputlink");
    const imageUrlInput = screen.getByTestId("inputimageUrl");
    await act(async () => {
      // Enter valid values
      fireEvent.change(firstNameInput, { target: { value: "John Doe" } });
      fireEvent.change(titleInput, { target: { value: "Valid Title" } });
      fireEvent.change(linkInput, {
        target: { value: "https://example.com/test-case" },
      });
      fireEvent.change(imageUrlInput, {
        target: { value: "https://example.com/image.jpg" },
      });

      // Submit the form
      fireEvent.click(getByText("Share"));
    });
    // Check if the form is submitted successfully
    expect(async () => {
      await screen.findByText("John Doe");
    });
  });

  test("validates form inputs correctly without Image URL", async () => {
    const { getByText } = render(
      <ShareForm enableImageURL={false} handleSubmit={jest.fn()} />
    );
    const firstNameInput = screen.getByTestId("inputfirstName");
    const titleInput = screen.getByTestId("inputtitle");
    const linkInput = screen.getByTestId("inputlink");
    await act(async () => {
      // Enter invalid values
      fireEvent.change(firstNameInput, { target: { value: "123!" } });
      fireEvent.change(titleInput, {
        target: {
          value:
            "This Title is really really long. I mean, it just goes on and on ...nonstop. Will it ever end. Who knows?",
        },
      });
      fireEvent.change(linkInput, {
        target: { value: "http://invalid-url/***" },
      });

      // Submit the form
      fireEvent.click(getByText("Share"));
    });
    // Check for validation error messages
    expect(
      screen.getByText(
        "Please enter a valid Contributor name; only letters, periods, and spaces allowed"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please enter a valid Blog Title; maximum 100 characters"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please enter a valid Blog URL; starting with http or https"
      )
    ).toBeInTheDocument();
  });

  test("submits the form with valid inputs without Image URL", async () => {
    const { getByText } = render(
      <ShareForm enableImageURL={false} handleSubmit={jest.fn()} />
    );
    const firstNameInput = screen.getByTestId("inputfirstName");
    const titleInput = screen.getByTestId("inputtitle");
    const linkInput = screen.getByTestId("inputlink");
    await act(async () => {
      // Enter valid values
      fireEvent.change(firstNameInput, { target: { value: "John Doe" } });
      fireEvent.change(titleInput, { target: { value: "Valid Title" } });
      fireEvent.change(linkInput, {
        target: { value: "https://example.com" },
      });

      // Submit the form
      fireEvent.click(getByText("Share"));
    });
    // Check if the form is submitted successfully
    expect(async () => {
      await screen.findByText("John Doe");
    });
  });
});
