import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import Blog from './Blog'
import MongoEntity from './MongoEntity'
import User from './User'

@ObjectType()
@Entity()
export default class Comment extends MongoEntity {
    constructor(comment: Partial<Comment>) {
        super()
        Object.assign(this, comment)
    }

    @Column({ nullable: false })
    @Field({ nullable: false })
    content: string

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'userName', referencedColumnName: 'name' })
    @Field(() => User)
    user: User

    @Column()
    @Index()
    userName: string

    @ManyToOne(() => Blog, (blog) => blog.comments)
    @JoinColumn({ name: 'blogId', referencedColumnName: '_id' })
    @Field(() => Blog)
    commentedBlog: Blog

    @Column()
    @Index()
    blogId: string
}
