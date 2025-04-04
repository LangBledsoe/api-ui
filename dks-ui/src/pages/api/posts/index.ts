import { NextApiRequest, NextApiResponse } from "next";

const apiUrl = process.env.DKS_API_BASE_URL || "http://localhost:8080";

async function deletePost(id: string) {
  await fetch(`${apiUrl}/posts/${id}`, {
    method: "DELETE",
  });
}

async function createPost(body: any) {
  const response = await fetch(`${apiUrl}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

async function getPosts() {
  const response = await fetch(`${apiUrl}/posts`);
  return await response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "DELETE") {
      const id = JSON.parse(req.body).id;
      if (!id) {
        return res.status(400).send("Missing id");
      } else if (typeof id === "string") {
        return res.status(400).send("Invalid id");
      } else {
        await deletePost(id);
        return res.send("ok");
      }
    } else if (req.method === "POST") {
      const data = req.body;
      if (!data.title || !data.firstName || !data.link) {
        return res.status(400).send("Invalid data");
      }
      await createPost(data);
      return res.status(200).json(data);
    } else if (req.method === "GET") {
      const posts = await getPosts();
      return res.status(200).json(posts);
    } else {
      return res.status(405).end();
    }
  } catch (e) {
    return res.status(500).send("Internal Server Error");
  }
}
