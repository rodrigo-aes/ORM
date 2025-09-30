import type { EntityTarget } from "../../types"
import type AndQueryBuilder from "../AndQueryBuilder"

export type AndQueryFunction<T extends EntityTarget> = (
    (queryBuilder: AndQueryBuilder<T>) => void
)