import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import Blog from './Blog'
import MongoEntity from './MongoEntity'
import User from './User'

@ObjectType()
@Entity()
export default class Like extends MongoEntity {
    constructor(like: Partial<Like>) {
        super()
        Object.assign(this, like)
    }

    @Column()
    @Field()
    isLiked: boolean

    @ManyToOne(() => Blog, (blog) => blog.likes)
    @Field(() => Blog)
    @JoinColumn({ name: 'blogId', referencedColumnName: 'blogId' })
    blog: Blog

    @ManyToOne(() => User, (user) => user.likes)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    @Field(() => User)
    user: User

    @Column()
    @Field()
    username: string

    @Column()
    @Field()
    blogId: string
}
