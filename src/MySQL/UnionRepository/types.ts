import type { EntityTarget, UnionEntityTarget } from "../../types/General"
import type BaseEntity from "../BaseEntity"
import type BaseEntityUnion from "../BaseEntityUnion"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes } from "../QueryBuilder"

export type UpdateQueryResult<
    T extends EntityTarget | UnionEntityTarget,
    Data extends (
        ((BaseEntity | BaseEntityUnion<any>) & InstanceType<T>) |
        UpdateAttributes<InstanceType<T>>
    )
> = (
        Data extends (BaseEntity & InstanceType<T>)
        ? InstanceType<T>
        : ResultSetHeader
    )