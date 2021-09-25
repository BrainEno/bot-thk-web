import cookie from 'js-cookie';
import Router from 'next/router';

type UserInput = {
  name?: string;
  email: string;
  password: string;
};

export const handleResponse = (response: Response) => {
  if (response.status === 401) {
    signout(() => {
      Router.push({
        pathname: '/signin',
        query: {
          message: '您的访问权限已过期，请重新登录'
        }
      });
    });
  }
};

export const preSignup = (user: UserInput) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/pre-signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const signup = (user: any) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const signin = (user: UserInput) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//signout
export const signout = (next: any) => {
  removeCookie('token');
  removeLocalStorage('user');
  next();

  return fetch(`${process.env.NEXT_PUBLIC_API}/signout`, {
    method: 'GET'
  })
    .then(() => {
      console.log('成功退出登录');
    })
    .catch((err) => {
      console.log(err);
    });
};

//set cookie
export const setCookie = (key: string, value: string) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1
    });
  }
};

//remove cookie
export const removeCookie = (key: string) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1
    });
  }
};

//get cookie
export const getCookie = (key: string) => {
  if (process.browser) {
    return cookie.get(key);
  }
};

//localstorage
export const setLocalStorage = (key: string, value: string) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key: string) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

//authenticate user by pass data to cookie and localstorage
export const authenticate = (data: any, next: any) => {
  setCookie('token', data.token);
  setLocalStorage('user', data.user);
  next();
};

export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie('token');
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user') as string);
      } else {
        return false;
      }
    }
  }
};

export const updateUser = (user: UserInput, next: any) => {
  if (process.browser) {
    if (localStorage.getItem('user')) {
      let auth = JSON.parse(localStorage.getItem('user') as string);
      auth = user;
      localStorage.setItem('user', JSON.stringify(auth));
      next();
    }
  }
};

export const forgotPassword = (email: any) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/forgot-password`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(email)
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const resetPassword = (resetInfo: any) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/reset-password`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resetInfo)
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};
