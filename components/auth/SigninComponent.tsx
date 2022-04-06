import React, { useEffect } from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { authenticate, isAuth,signin } from '../../actions/auth';

const SigninComponent = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    email: '',
    password: '',
    loading: false,
    error: '',
    showForm: true
  });

  const { email, password, error, loading, showForm } = values;

  useEffect(() => {
    isAuth() && router.push('/');
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value, error: '' });
  };

  const handleSubmit: React.FormEventHandler = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (values.email.trim() === '') {
      setValues({
        ...values,
        loading: false,
        error: '邮箱地址不得为空，请重新输入'
      });
    } else if (values.password.trim() === '') {
      setValues({
        ...values,
        loading: false,
        error: '密码不得为空，请重新输入'
      });
    } else {
      setValues({ ...values, loading: true, error: '' });
      const user = { email, password };

      signin(user).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            if (isAuth() && isAuth().role === 1) {
              router.push(`/admin`);
            } else {
              router.push('/user');
            }
          });
        }
      });
    }
  };

  const errorType = {
    email: false,
    password: false
  };

  if (error)
    errorType.email =
      error !== '' &&
      (error === '邮箱地址不得为空，请重新输入' ||
        error === '请输入有效的邮箱地址' ||
        error === '此邮箱账户的尚未注册，请先注册');

  if (error)
    errorType.password =
      error !== '' &&
      (error === '密码不得为空，请重新输入' ||
        error === '您的邮箱和密码不匹配，请重新输入' ||
        error === '密码长度不得小于6个字符');

  const showLoading = () =>
    loading ? <div className="alert">正在加载...</div> : '';

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit} className="sign-form">
        <div className="form-group">
          <label
            htmlFor="inputEmail"
            className={classNames({ error: errorType.email })}
          >
            {(errorType.email && error) || '邮箱'}
          </label>
          <input
            id="inputEmail"
            className={classNames('form-input', {
              isInvalid: errorType.email,
              error: errorType.email
            })}
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="请输入您的邮箱"
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="inputEmail"
            className={classNames({ error: errorType.password })}
          >
            {(errorType.password && error) || '密码'}
          </label>
          <input
            type="password"
            className={classNames('form-input', {
              isInvalid: errorType.password,
              error: errorType.password
            })}
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="请输入您的密码"
          />
        </div>
        <button type="submit" className="form-btn">
          登 录
        </button>
      </form>
    );
  };

  return (
    <>
      {loading && showLoading()}
      {showForm && signinForm()}
      <Link href="/auth/password/forgot" passHref>
        <span
          style={{
            textDecoration: 'underline',
            cursor: 'pointer',
            color: '#0879bf !important',
            margin: '10px 0 25px'
          }}
        >
          忘记密码
        </span>
      </Link>
    </>
  );
};

export default SigninComponent;
