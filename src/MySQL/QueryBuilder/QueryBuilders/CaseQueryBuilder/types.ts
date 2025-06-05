import type { EntityTarget } from "../../../../types/General"
import type WhereQueryBuilder from "../WhereQueryBuilder"

export type CaseQueryFunction<T extends EntityTarget> = (
    (queryBuilder: WhereQueryBuilder<T>) => void
)

export type CaseQueryTuple<T extends EntityTarget> = [
    WhereQueryBuilder<T>,
    any
]