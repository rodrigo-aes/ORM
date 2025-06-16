import type { EntityTarget } from "../../types/General"
import type BaseEntity from "../BaseEntity"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes } from "../QueryBuilder"

export type UpdateQueryResult<
    T extends EntityTarget,
    Data extends (
        (BaseEntity & InstanceType<T>) |
        UpdateAttributes<InstanceType<T>>
    )
> = (
        Data extends (BaseEntity & InstanceType<T>)
        ? InstanceType<T>
        : ResultSetHeader
    )