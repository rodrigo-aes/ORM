import type { EntityTarget, EntityUnionTarget } from "../../types/General"
import type BaseEntity from "../BaseEntity"
import type PolymorphicEntity from "../PolymorphicEntity"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes } from "../QueryBuilder"

export type UpdateQueryResult<
    T extends EntityTarget | EntityUnionTarget,
    Data extends (
        ((BaseEntity | PolymorphicEntity<any>) & InstanceType<T>) |
        UpdateAttributes<InstanceType<T>>
    )
> = (
        Data extends (BaseEntity & InstanceType<T>)
        ? InstanceType<T>
        : ResultSetHeader
    )