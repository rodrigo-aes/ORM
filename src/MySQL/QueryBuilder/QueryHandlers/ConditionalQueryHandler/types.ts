import type { EntityTarget } from "../../../../types/General"
import type CaseQueryHandler from "../CaseQueryHandler"

export type CaseQueryFunction<T extends EntityTarget> = (
    (queryBuilder: CaseQueryHandler<T>) => void
)