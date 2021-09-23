import { Field, ObjectType } from 'type-graphql'
import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
} from 'typeorm'
import { slugify } from '../utils/slugify'
import Blog from './Blog'
import MongoEntity from './MongoEntity'

@ObjectType()
@Entity('categories')
export default class Category extends MongoEntity {
    constructor(category: Partial<Category>) {
        super()
        Object.assign(this, category)
    }

    @Column({ nullable: false })
    @Field({ nullable: false })
    name: string

    @Column({ nullable: false, unique: true })
    @Field({ nullable: false })
    @Index()
    slug: string

    @ManyToMany(() => Blog, (blog) => blog.categories)
    @Field(() => [Blog])
    @JoinColumn({ name: 'blogIds', referencedColumnName: '_id' })
    blogs: Blog[]

    // @Column()
    @Field(() => String)
    blogIds: string[]

    @BeforeInsert()
    makeSlug() {
        this.slug = slugify(this.name)
    }
}
