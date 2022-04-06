import { Field, ObjectType } from 'type-graphql';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany
} from 'typeorm';

import { slugify } from '../utils/slugify';

import Blog from './Blog';
import MongoEntity from './MongoEntity';

@ObjectType()
@Entity('tags')
export default class Tag extends MongoEntity {
  constructor(tag: Partial<Tag>) {
    super();
    Object.assign(this, tag);
  }

  @Column({ nullable: false })
  @Field({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  @Field({ nullable: false })
  @Index()
  slug: string;

  @ManyToMany(() => Blog, (blog) => blog.tags)
  @JoinColumn({ name: 'blogIds', referencedColumnName: '_id' })
  @Field(() => [Blog])
  blogs: Blog[];

  @Column()
  @Field(() => String)
  blogIds: string[];

  @BeforeInsert()
  makeSlug() {
    this.slug = slugify(this.name);
  }
}
