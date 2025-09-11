import type { EntityTarget } from "../../types/General"
import type WhereQueryBuilder from "../WhereQueryBuilder"

export type WhereQueryFunction<T extends EntityTarget> = (
    (queryBuilder: WhereQueryBuilder<T>) => void
)
