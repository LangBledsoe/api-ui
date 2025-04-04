export const performDelete = async (key: string) => {
  let config = {
    method: "DELETE",
    body: JSON.stringify({
      id: key,
    }),
  };

  await fetch("/api/posts", config);
};

export const postFormData = async (data: any) => {
  let config = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  return await fetch("/api/posts", config);
};

export const getPosts = async () => {
  let config = {
    method: "GET",
  };

  return await fetch("/api/posts", config);
};
