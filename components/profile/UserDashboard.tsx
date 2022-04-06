import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined, FormOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NextRouter, withRouter } from 'next/router';

import { isAuth } from '../../actions/auth';
import { loadUser, loadUserProfile } from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import Avatar from '../Avatar';

import MenuItem from './MenuItem';
import UserBlogs from './UserBlogs';

dayjs.extend(relativeTime);

const UserDashboard = ({ router }: { router: NextRouter }) => {
  const selectUser = (state: RootState) => state.user;
  const selectUserProfile = (state: RootState) => state.userProfile;
  const user = useSelector(selectUser);
  const userProfile = useSelector(selectUserProfile);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadUserProfile());
  }, [router, dispatch]);

  return (
    <div className="user-dashboard">
      <div className="userInfo-container">
        <div className="userInfo">
          <div className="avatar-container">
            <a href={`/profile/${user.username}`}>
              <Avatar
                title="查看所有"
                size={100}
                radius={100}
                src={`${process.env.NEXT_PUBLIC_API}/user/photo/${user.username}`}
              />
            </a>
          </div>
          <span>{user.name}</span>
          <div>
            <span className="userInfo-text">{user.email}</span>
            {userProfile && (
              <span className="userInfo-text">
                Joined <b>BOT THK</b>
                {' ' + dayjs(userProfile.user.createdAt, 'zh').fromNow()}
              </span>
            )}
          </div>
        </div>

        <ul>
          <MenuItem
            href="/"
            title="返回首页"
            renderIcon={(color) => <HomeOutlined style={{ color }} />}
          />
          <MenuItem
            href={
              isAuth() && isAuth().role === 1
                ? '/admin/crud/blog'
                : '/user/crud/blog'
            }
            title="新建文章"
            renderIcon={(color) => <FormOutlined style={{ color }} />}
          />
          <MenuItem
            href={
              isAuth() && isAuth().role === 1
                ? '/admin/crud/blog'
                : '/user/crud/blog'
            }
            title="编辑文章"
            renderIcon={(color) => <EditOutlined style={{ color }} />}
          />
        </ul>
      </div>

      <UserBlogs blogs={userProfile.blogs} user={user} />
    </div>
  );
};

export default withRouter(UserDashboard);
