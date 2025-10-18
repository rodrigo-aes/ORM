import type {
    Entity,
    Target,
    EntityRelationsKeys,
    EntityRelations,
    Constructor
} from '../../types'

import type { ConditionalQueryHandler } from '../types'

export type EntityExistsQueryOptions<T extends Target> = Partial<{
    [K in EntityRelationsKeys<InstanceType<T>>]: (
        boolean |
        EntityExistsQueryOption<
            Extract<EntityRelations<InstanceType<T>>[K], Entity>
        >
    )
}>

export type EntityExistsQueryOption<T extends Entity> = {
    relations?: EntityExistsQueryOptions<Extract<Constructor<T>, Target>>
    where?: ConditionalQueryHandler<Extract<Constructor<T>, Target>>
}

export type ExistsQueryOptions<T extends Target> = (
    string | EntityExistsQueryOptions<T>
)