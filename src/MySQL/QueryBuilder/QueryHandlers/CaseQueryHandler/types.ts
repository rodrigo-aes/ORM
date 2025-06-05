import type { EntityTarget } from "../../../../types/General"
import type WhereQueryHandler from "../WhereQueryHandler"

export type CaseQueryFunction<T extends EntityTarget> = (
    (queryBuilder: WhereQueryHandler<T>) => void
)

export type CaseQueryTuple<T extends EntityTarget> = [
    WhereQueryHandler<T>,
    any
]