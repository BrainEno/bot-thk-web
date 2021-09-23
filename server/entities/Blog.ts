import { Min, MinLength } from 'class-validator'
import { Field, ObjectType } from 'type-graphql'
import {
    Column,
    Index,
    OneToMany,
    ObjectID,
    Entity,
    JoinColumn,
    ManyToMany,
} from 'typeorm'
import MongoEntity from './MongoEntity'
import Category from './Category'
import Tag from './Tag'
import User from './User'
import Like from './Like'
import Comment from './Comment'

@ObjectType()
@Entity('blogs')
export default class Blog extends MongoEntity {
    constructor(blog: Partial<Blog>) {
        super()
        Object.assign(this, blog)
    }

    @Column()
    @Field()
    @Index()
    @MinLength(1, { message: '标题不得为空' })
    title: string

    @Column({ unique: true })
    @Field()
    @Index()
    slug: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    description?: string

    @Column({ nullable: false })
    @Field({ nullable: false })
    @Min(50)
    body: string

    @Column({ unique: true })
    @Field()
    mtitle: string

    @Column({ unique: true })
    @Field()
    image: string

    @OneToMany(() => ObjectID, (id) => id)
    @Field(() => [Tag])
    tags: ObjectID[]

    @Column(() => ObjectID)
    @Field(() => User)
    author: ObjectID[]

    @Column()
    @Field()
    active: boolean

    @Column(() => ObjectID)
    @Field(() => Like)
    likes: ObjectID

    @OneToMany(() => Comment, (comment) => comment.commentedBlog)
    @Field(() => [Comment])
    comments: Comment[]

    @Column()
    @Field(() => [String])
    commentsIds: string[]

    @ManyToMany(() => Category, (category) => category.blogs)
    @JoinColumn({ name: 'categoryNames', referencedColumnName: 'name' })
    @Field(() => [Category])
    categories: Category[]

    @Column()
    @Field(() => [String])
    categoriyNames: string[]
}
