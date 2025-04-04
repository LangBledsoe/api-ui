import { http, HttpResponse } from "msw";

const testData = [
  {
    objectId: 1,
    firstName: "John Wick",
    title: "The HighTable",
    link: "https://thecontinental.com/blogs/?id=1",
    datePosted: "Tue 04/02/2024 16:51:25:233 UTC",
    imageUrl: null,
    dateAsDate: "2024-04-02T16:51:25.233+00:00",
    id: 1,
  },
  {
    objectId: 2,
    firstName: "Batman",
    title: "Why I Smile",
    link: "https://thejokerisdumb.com",
    datePosted: "Tue 04/02/2024 16:52:2:582 UTC",
    imageUrl: null,
    dateAsDate: "2024-04-02T16:52:02.582+00:00",
    id: 2,
  },
  {
    objectId: 3,
    firstName: "Jesse Pinkman",
    title: "Breaking Good",
    link: "https://blahblahblah.com",
    datePosted: "Tue 04/02/2024 16:52:47:773 UTC",
    imageUrl: null,
    dateAsDate: "2024-04-02T16:52:47.773+00:00",
    id: 3,
  },
];
const apiUrl = process.env.DKS_API_BASE_URL || "http://localhost:8080";
export const handlers = [
  http.delete(`${apiUrl}/posts/2`, () => {
    return HttpResponse.json({
      testData: testData.filter((post) => post.id !== 2),
    });
  }),
  http.post(`${apiUrl}/posts`, () => {
    const newPostData = {
      firstName: "John Doe",
      title: "Hello World",
      link: "https://example.com",
    };
    const postDate = new Date();
    const postID = testData.length + 1;
    const newPost = {
      ...newPostData,
      id: postID,
      objectId: postID,
      imageUrl: null,
      datePosted: postDate.toISOString(),
      dateAsDate: postDate.toISOString(),
    };
    return HttpResponse.json({
      testData: [...testData, newPost],
    });
  }),
];
