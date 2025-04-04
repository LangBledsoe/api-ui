import { performDelete, postFormData } from "./api";

describe("API Utils", () => {
  beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("performDelete", () => {
    test("should send a DELETE request with the correct payload", async () => {
      const key = "123";

      await performDelete(key);

      expect(fetch).toHaveBeenCalledWith("/api/posts", {
        method: "DELETE",
        body: JSON.stringify({
          id: key,
        }),
      });
    });
  });

  describe("postFormData", () => {
    test("should send a POST request with the correct payload and headers", async () => {
      const data = {
        firstName: "John",
        link: "https://example.com",
        title: "Hello World",
      };

      await postFormData(data);

      expect(fetch).toHaveBeenCalledWith("/api/posts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    });

    test("should return the response from the server", async () => {
      const data = {
        name: "John",
        link: "https://example.com",
        title: "Hello World",
      };
      const mockResponse = { status: 200 };
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const response = await postFormData(data);

      expect(response).toEqual(mockResponse);
    });
  });
});
