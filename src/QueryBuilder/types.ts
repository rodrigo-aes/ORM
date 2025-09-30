import type { Target } from "../types"

import type SelectQueryBuilder from "./SelectQueryBuilder"
import type CountQueryBuilder from "./CountQueryBuilder"
import type AndQueryBuilder from "./AndQueryBuilder"
import type CaseQueryBuilder from "./CaseQueryBuilder"
import type ConditionalQueryHandler from "./ConditionalQueryBuilder"
import type JoinQueryBuilder from "./JoinQueryBuilder"

import type PaginateQueryBuilderType from "./PaginateQueryBuilder"

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
    (qb: ConditionalQueryHandler<T>) => void
)

export type OnQueryHandler<T extends Target> = (
    (qb: ConditionalQueryHandler<T>) => void
)

export type JoinQueryHandler<T extends Target> = (
    (qb: JoinQueryBuilder<T>) => void
)

export type PaginateQueryBuilder<T extends Target> = Omit<
    PaginateQueryBuilderType<T>, (
        'limit' |
        'offset'
    )>