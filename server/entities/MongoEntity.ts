import { classToPlain } from 'class-transformer'
import {
    BaseEntity,
    ObjectIdColumn,
    ObjectID,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

export default abstract class MongoEntity extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectID

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt?: Date

    toJSON() {
        return classToPlain(this)
    }
}
