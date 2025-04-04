import { Blog } from "./index.page";

describe("Blog interface", () => {
  test("should have the correct properties", () => {
    const blog: Blog = {
      title: "Sample Blog",
      firstName: "John",
      link: new URL("https://example.com"),
    };

    expect(blog.title).toBeDefined();
    expect(blog.firstName).toBeDefined();
    expect(blog.link).toBeDefined();
  });

  test("should have optional properties", () => {
    const blog: Blog = {
      title: "Sample Blog",
      firstName: "John",
      link: new URL("https://example.com"),
      imageUrl: new URL("https://example.com/image.jpg"),
      dateAsDate: new Date(),
    };

    expect(blog.imageUrl).toBeDefined();
    expect(blog.dateAsDate).toBeDefined();
  });
});
