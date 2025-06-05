import type { EntityTarget } from "../../../../types/General"
import type AndQueryHandler from "../AndQueryHandler"

export type WhereQueryFunction<T extends EntityTarget> = (
    (queryBuilder: AndQueryHandler<T>) => void
)