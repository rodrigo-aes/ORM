import type { Target } from '../../../types'
import { Exists, Cross } from './Symbol'
import type {
    EntityRelationsKeys,
    EntityRelations,
    Constructor
} from '../../../types'
import { ConditionalQueryOptions } from '../types'
import { Foo } from '../../../TestTools/Entities'

export type EntityExistsQueryOptions<Entity extends object> = Partial<{
    [K in EntityRelationsKeys<Entity>]: boolean | EntityExistsQueryOption<
        Extract<EntityRelations<Entity>[K], object>
    >
}>

export type EntityExistsQueryOption<Entity extends object> = {
    relations?: EntityExistsQueryOptions<Entity>
    where?: ConditionalQueryOptions<Entity>
}

export type EntityCrossExistsOption<Entity extends object> = (
    { target: Constructor<Entity> } & EntityExistsQueryOption<Entity>
)

export type EntityCrossExistsOptions<Entities extends object[] = object[]> = {
    [K in keyof Entities]: EntityCrossExistsOption<Entities[K]>
}

export type ExistsQueryOptions<Entity extends object> = {
    [Exists]: string | (
        EntityExistsQueryOptions<Entity> &
        Partial<{ [Cross]: EntityCrossExistsOptions }>
    )
}