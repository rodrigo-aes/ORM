import type { Target } from "../types"

import type SelectQueryBuilder from "./SelectQueryBuilder"
import type CountQueryBuilder from "./CountQueryBuilder"
import type AndQueryBuilder from "./AndQueryBuilder"
import type CaseQueryBuilder from "./CaseQueryBuilder"
import type ConditionalQueryBuilder from "./ConditionalQueryBuilder"
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

export type ConditionalQueryHandler<T extends Target> = (
    (qb: ConditionalQueryBuilder<T>) => void
)

export type JoinQueryHandler<T extends Target> = (
    (qb: JoinQueryBuilder<T>) => void
)

export type PaginateQueryBuilder<T extends Target> = Omit<
    PaginateQueryBuilderType<T>, (
        'limit' |
        'offset'
    )>

export type PartialQueryBuilder<T extends Target> = (
    SelectQueryBuilder<T> |
    CountQueryBuilder<T> |
    AndQueryBuilder<T> |
    CaseQueryBuilder<T> |
    ConditionalQueryBuilder<T> |
    JoinQueryBuilder<T>
)
export type QueryHandler<
    T extends Target,
    QB extends PartialQueryBuilder<T>
> = QB extends SelectQueryBuilder<T>
    ? SelectQueryHandler<T>
    : QB extends CountQueryBuilder<T>
    ? CountQueryHandler<T>
    : QB extends AndQueryBuilder<T>
    ? AndQueryHandler<T>
    : QB extends CaseQueryBuilder<T>
    ? CaseQueryHandler<T>
    : QB extends ConditionalQueryBuilder<T>
    ? ConditionalQueryHandler<T>
    : QB extends JoinQueryBuilder<T>
    ? JoinQueryHandler<T>
    : never