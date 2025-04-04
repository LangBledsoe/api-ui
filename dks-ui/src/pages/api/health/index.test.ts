import { NextResponse } from "next/server";
import handler from "./index";

describe("Test API Health Response", () => {
  test("should return a NextResponse object", async () => {
    const response = await handler();

    expect(response).toBeInstanceOf(NextResponse);
  });

  test("should return a status of 200", async () => {
    const response = await handler();

    expect(response.status).toBe(200);
  });
});
