import type { EntityTarget, PolymorphicEntityTarget } from "../types"
import type BaseEntity from "../BaseEntity"
import type BasePolymorphicEntity from "../BasePolymorphicEntity"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes } from "../SQLBuilders"
import type { CountQueryOptions } from "../SQLBuilders"

export type UpdateQueryResult<
    T extends EntityTarget | PolymorphicEntityTarget,
    Data extends (
        ((BaseEntity | BasePolymorphicEntity<any>) & InstanceType<T>) |
        UpdateAttributes<InstanceType<T>>
    )
> = (
        Data extends (BaseEntity & InstanceType<T>)
        ? InstanceType<T>
        : ResultSetHeader
    )

export type CountManyQueryResult<
    T extends EntityTarget | PolymorphicEntityTarget,
    Opts extends CountQueryOptions<InstanceType<T>>
> = { [K in keyof Opts]: number }