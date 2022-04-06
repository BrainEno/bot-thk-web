import React, { useEffect, useRef, useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { isAuth, signout } from '../actions/auth';
import useScrollDown from '../hooks/useScrollDown';

import Search from './blog/Search';
import Avatar from './Avatar';
import MyBrand from './MyBrand';

const Header = () => {
  const router = useRouter();
  const scrollDown = useScrollDown();
  const [menuActive, setMenuActive] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);

  const handleMenuClick = (e: MouseEvent) => {
    e.preventDefault();
    setMenuActive(!menuActive);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current!.contains(e.target as any) &&
      !btnRef.current!.contains(e.target as any)
    ) {
      setMenuActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuRef, menuActive]);

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <nav
      className="site-navigation"
      style={
        scrollDown
          ? { opacity: '0', top: '-65px' }
          : { opacity: '1', top: '0px' }
      }
    >
      <span className="menu-title">
        <MyBrand width={45} height={45} fontSize={'24px'} cursor="pointer" />
      </span>
      <div
        className={`menu-content-container ${menuActive && 'active'}`}
        onMouseLeave={() => setMenuActive(false)}
        ref={menuRef}
      >
        <ul>
          <li>
            <Link href="/">首页</Link>
          </li>
          <li>
            <Link href="/blogs/">全部</Link>
          </li>
          <li>
            <Link href="/tags/novel">小说</Link>
          </li>
          <li>
            <Link href="/tags/poetry">诗歌</Link>
          </li>
          <li>
            <Link href="/tags/original">原创</Link>
          </li>
          <li>
            <Link href="/tags/else">其他</Link>
          </li>
        </ul>
        <Search />

        {isAuth() ? (
          <ul className="log-ul">
            <li>
              <a
                onClick={() =>
                  signout(() => {
                    router.replace('/signin');
                  })
                }
              >
                退出登录
              </a>
            </li>{' '}
          </ul>
        ) : (
          <ul className="log-ul">
            <li>
              <Link href="/signin">登录</Link>
            </li>
            <li>
              <Link href="/signup">注册</Link>
            </li>
          </ul>
        )}

        <div className="menu-avtar-container">
          {isAuth() && (
            <Link
              href={isAuth() && isAuth().role === 1 ? `/admin/` : `/user/`}
              passHref
            >
              <div className="my-avatar">
                {!!isAuth().username && (
                  <Avatar
                    title="个人主页"
                    size={38}
                    radius={38}
                    src={`${process.env.NEXT_PUBLIC_API}/user/photo/${
                      isAuth().username
                    }`}
                  />
                )}
              </div>
            </Link>
          )}
          {isAuth() && <p className="menu-avtar-name">{isAuth().name}</p>}
        </div>
      </div>

      <MenuOutlined onClick={handleMenuClick as any} ref={btnRef} />
    </nav>
  );
};

export default Header;
