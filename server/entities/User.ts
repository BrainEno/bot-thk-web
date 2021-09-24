import { IsEmail, Length, MaxLength, MinLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany
} from 'typeorm';
import MongoEntity from './MongoEntity';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import Like from './Like';
import Comment from './Comment';

@ObjectType()
@Entity('users')
export default class User extends MongoEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Field()
  @Index()
  @MinLength(1, { message: '用户名不能为空' })
  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  @Field()
  @Index()
  @MinLength(1, { message: '用户名不得为空' })
  @MaxLength(32)
  name: string;

  @Field()
  @Index()
  @IsEmail(undefined, { message: '请填写有效的邮箱地址' })
  @Length(1, 255, { message: '邮箱地址不能为空' })
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Field()
  profile: string;

  @Column()
  hashed_password: string;

  @Column()
  salt?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  about?: string;

  @Column({ nullable: false, default: '0' })
  @Field()
  role: string;

  @Column({
    default:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png'
  })
  @Field({
    defaultValue:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png'
  })
  photo: string;

  @Column({ default: '' })
  @Field({ defaultValue: '' })
  resetPasswordLink: string;

  @Column()
  @MinLength(6, { message: '密码不能小于6个字符' })
  password: string;

  @OneToMany(() => Like, (like) => like.user)
  @Field(() => [Like])
  @JoinColumn({ name: 'likedBlogs', referencedColumnName: 'blogId' })
  likes: Like[];

  @Column()
  likedBlogs: string[];

  @Column()
  @OneToMany(() => Comment, (comment) => comment.user)
  @Field(() => [Comment])
  comments: Comment[];

  @BeforeInsert()
  makeSalt() {
    this.salt = uuidv4();
  }

  @BeforeInsert()
  async hashPassword() {
    this.hashed_password = await bcrypt.hash(this.password, 12);
  }
}
