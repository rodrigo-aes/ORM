import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type SelectQueryBuilder from "./SelectQueryBuilder"
import type CountQueryBuilder from "./CountQueryBuilder"
import type AndQueryBuilder from "./AndQueryBuilder"
import type CaseQueryBuilder from "./CaseQueryBuilder"
import type WhereQueryBuilder from "./WhereQueryBuilder"
import type JoinQueryBuilder from "./JoinQueryBuilder"

import type PaginateQueryBuilderType from "./PaginateQueryBuilder"

type Target = EntityTarget | PolymorphicEntityTarget

export type SelectQueryHandler<T extends Target> = (
    (qb: SelectQueryBuilder<T>) => void
)

export type CountQueryHandler<T extends Target> = (
    (qb: CountQueryBuilder<T>) => void
)

export type AndQueryHandler<T extends Target> = (
    (qb: AndQueryBuilder<T>) => void
)

export type CaseQueryHandler<T extends Target> = (
    (qb: CaseQueryBuilder<T>) => void
)

export type WhereQueryHandler<T extends Target> = (
    (qb: WhereQueryBuilder<T>) => void
)

export type JoinQueryHandler<T extends Target> = (
    (qb: JoinQueryBuilder<T>) => void
)

export type PaginateQueryBuilder<T extends Target> = Omit<
    PaginateQueryBuilderType<T>, (
        'limit' |
        'offset'
    )>