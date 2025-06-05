import type { EntityTarget } from "../../../../types/General"
import type CaseQueryBuilder from "../CaseQueryBuilder"

export type CaseQueryFunction<T extends EntityTarget> = (
    (queryBuilder: CaseQueryBuilder<T>) => void
)