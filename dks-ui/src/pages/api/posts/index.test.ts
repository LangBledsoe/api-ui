import {
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
  expect,
} from "@jest/globals";
import { server } from "../../../../mocks/server";
import handler from "./index";
import { NextApiRequest, NextApiResponse } from "next";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("API handler", () => {
  let req: NextApiRequest;
  let res: NextApiResponse;

  beforeEach(() => {
    req = { method: "", body: {}, query: {} } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as any;
  });

  test("should handle POST request", async () => {
    req.method = "POST";
    req.body = {
      title: "Hello World",
      link: "https://example.com",
      firstName: "John Doe",
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should handle DELETE request", async () => {
    req.method = "DELETE";
    req.body = JSON.stringify({ id: 2 });
    await handler(req, res);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  test("should handle invalid method", async () => {
    req.method = "PUT";
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
});
