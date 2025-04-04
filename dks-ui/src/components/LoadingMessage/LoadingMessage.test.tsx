import { render, screen } from "@testing-library/react";
import LoadingMessage from "./LoadingMessage";

function doRender(children: string) {
  render(<LoadingMessage>{children}</LoadingMessage>);
}

describe("LoadingMessage", () => {
  test("renders message passed as children", () => {
    doRender("testMessage");
    const children = screen.getByText(/testMessage/);

    expect(children).toBeInTheDocument();
  });
});
