import { handleResponse } from './auth';

export const userPublicProfile = (username: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/${username}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const getProfile = (token: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/profile`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const update = (token: string, user: any) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/user/update`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: user
  })
    .then((res) => {
      handleResponse(res);
      return res.json();
    })
    .catch((err) => console.log(err));
};
