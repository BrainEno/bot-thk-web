export const emailContactForm = (data: any) => {
  let emailEndpoint;

  if (data.authorEmail) {
    emailEndpoint = `${process.env.NEXT_PUBLIC_API}/contact-blog-author`;
  } else {
    emailEndpoint = `${process.env.NEXT_PUBLIC_API}/contact`;
  }

  return fetch(`${emailEndpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};
