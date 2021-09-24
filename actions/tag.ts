import { handleResponse } from './auth';

//create tags
export const createTag = (tag: any, token: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/tag`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(tag)
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

//list tags
export const listTags = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/tags`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//read tag
export const singleTag = (slug: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/tag/${slug}`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//delete tag
export const removeTag = (slug: string, token: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/tag/${slug}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};
