import { Max, Min } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToOne } from 'typeorm';

import MongoEntity from './MongoEntity';
import User from './User';

@ObjectType()
@Entity('messages')
export default class Message extends MongoEntity {
  constructor(message: Partial<Message>) {
    super();
    Object.assign(this, message);
  }

  @Column()
  @Field()
  @Min(1)
  @Max(500)
  msgContent: string;

  @OneToOne(() => User, (user) => user.name)
  @Field(() => User)
  form: User;

  @OneToOne(() => User, (user) => user.name)
  @Field(() => User)
  to: User;
}
