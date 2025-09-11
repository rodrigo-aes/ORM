import type {
    EntityTarget,
    PolymorphicEntityTarget
} from '../../../types/General'
import type { Exists, Cross } from './Symbol'
import type { ConditionalQueryOptions } from '../types'

export type CrossExistsOption<
    T extends EntityTarget | PolymorphicEntityTarget = any
> = {
    target: T
    where?: ConditionalQueryOptions<InstanceType<T>>
}

export type CrossExistsQueryOptions = {
    [Cross]?: CrossExistsOption[]
}

export type ExistsQueryOptions<Entity extends Object> = {
    [Exists]: (
        string |
        ConditionalQueryOptions<Entity> & CrossExistsQueryOptions
    )
}