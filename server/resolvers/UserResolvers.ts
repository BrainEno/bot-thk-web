import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import User from '../entities/User';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import { preRegisterTemplate } from '../utils/sendgridTemplate';
import { AuthenticationError } from 'apollo-server-errors';
import { v4 as uuidv4 } from 'uuid';
import { isEmail, isEmpty, validate } from 'class-validator';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

@Resolver()
class UserResolvers {
  @Query(() => String)
  hello() {
    return 'Hello from userResolver';
  }

  @Query(() => User)
  currentUser(username: string) {
    return User.findOne({ username });
  }

  @Mutation(() => String)
  async preSignup(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const errors: any = [];
    const isUserExist = await User.findOne({ name: name.toLowerCase() });
    if (isUserExist) errors.name = '该昵称已被占用，换一个试试';
    const isEmailExist = await User.findOne({ email: email.toLowerCase() });
    if (isEmailExist) errors.email = '该邮箱已注册，请登录或找回密码';

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION!,
      { expiresIn: '10m' }
    );

    const emailData = {
      from: {
        name: 'BOT THK',
        email: process.env.EMAIL_FROM!
      },
      to: email,
      subject: `激活账号`,
      html: preRegisterTemplate(token)
    };

    try {
      const sent = await sgMail.send(emailData);
      if (sent)
        return `验证地址已发送至您的邮箱:${email},请跟随提示激活您的账户。`;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation(() => User)
  async signup(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const errors: any = [];
    try {
      const isUserExist = await User.findOne({ name: name.toLowerCase() });
      if (isUserExist) errors.name = '该昵称已被占用，换一个试试';
      const isEmailExist = await User.findOne({
        email: email.toLowerCase()
      });
      if (isEmailExist) errors.email = '该邮箱已注册，请登录或找回密码';
      const username = uuidv4();
      const profile = `${process.env.CLIENT_URL}/profile/${username}`;
      const user = new User({
        name,
        email,
        password,
        profile,
        username,
        role: '0'
      });

      // errors = await validate(user)
      // if (errors) throw new Error(errors)
      await user.save();
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation(() => User)
  async register(@Arg('token') token: string) {
    let errors: any = {};
    try {
      if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION!, (error) => {
          if (error) throw new AuthenticationError('该链接已失效，请重新注册');
        });
      }

      const jwtPayload = jwt.decode(token) as {
        name: string;
        email: string;
        password: string;
      };

      const { name, email, password } = jwtPayload;
      const username = uuidv4();
      const profile = `${process.env.CLIENT_URL}/profile/${username}`;
      const user = new User({
        name,
        email,
        password,
        profile,
        username,
        role: '0'
      });

      errors = await validate(user);
      if (errors) throw new Error(errors);
      await user.save();
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const errors: any = {};
    try {
      if (isEmpty(email)) errors.email = '邮箱不得为空';
      if (isEmail(email)) errors.email = '邮箱格式不正确';
      if (isEmpty(password)) errors.username = '密码不得为空';
      const user = await User.findOne({ email });
      if (!user) errors.email = '未找到邮箱，请先注册';
      if (Object.keys(errors).length) throw Error(errors);

      const passwordMatches = bcrypt.compare(password, user!.hashed_password);
      if (!passwordMatches)
        throw new AuthenticationError('邮箱和密码不匹配，请重新输入');

      const token = jwt.sign(
        { _id: user!._id, role: user!.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: '1d'
        }
      );

      return { token, user };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default UserResolvers;
