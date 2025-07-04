import type { EntityTarget } from "../../../../types/General"
import type AndQueryBuilder from "../AndQueryBuilder"

export type WhereQueryFunction<T extends EntityTarget> = (
    (queryBuilder: AndQueryBuilder<T>) => void
)