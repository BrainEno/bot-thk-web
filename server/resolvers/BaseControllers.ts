import { Arg, ClassType, Mutation, Query, Resolver } from 'type-graphql';

export function createBaseResolverZ<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query(() => [returnType], { name: `getAll${suffix}` })
    async getAll(): Promise<T[] | unknown> {
      try {
        const items = await entity.find();
        return items;
      } catch (error) {
        return error;
      }
    }

    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg('data', () => inputType) data: X) {
      return entity.create(data).save();
    }

    @Mutation(() => returnType, { name: `delete${suffix}` })
    async delete(@Arg('id') id: string): Promise<T | unknown> {
      try {
        const itemToDel = await entity.findOneOrFail({ id });
        if (itemToDel) {
          const deletedItem = await entity.remove();
          return deletedItem;
        }
      } catch (error) {
        return error;
      }
    }
  }

  return BaseResolver;
}
