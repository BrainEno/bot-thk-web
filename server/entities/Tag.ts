import { Field, ObjectType } from 'type-graphql'
import { BeforeInsert, Column, Entity, Index } from 'typeorm'
import { slugify } from '../utils/slugify'
import MongoEntity from './MongoEntity'

@ObjectType()
@Entity('tags')
export default class Tag extends MongoEntity {
    constructor(tag: Partial<Tag>) {
        super()
        Object.assign(this, tag)
    }

    @Column({ nullable: false })
    @Field({ nullable: false })
    name: string

    @Column({ nullable: false, unique: true })
    @Field({ nullable: false })
    @Index()
    slug: string

    @BeforeInsert()
    makeSlug() {
        this.slug = slugify(this.name)
    }
}
