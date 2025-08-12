import type { EntityTarget, EntityUnionTarget } from "../../types/General"
import type BaseEntity from "../BaseEntity"
import type BaseEntityUnion from "../BaseEntityUnion"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes } from "../QueryBuilder"

export type UpdateQueryResult<
    T extends EntityTarget | EntityUnionTarget,
    Data extends (
        ((BaseEntity | BaseEntityUnion<any>) & InstanceType<T>) |
        UpdateAttributes<InstanceType<T>>
    )
> = (
        Data extends (BaseEntity & InstanceType<T>)
        ? InstanceType<T>
        : ResultSetHeader
    )