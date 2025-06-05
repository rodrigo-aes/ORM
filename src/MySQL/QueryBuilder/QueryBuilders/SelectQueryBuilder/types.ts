import type { EntityTarget } from "../../../../types/General"

import type { SelectPropertyKey } from "../../SelectSQLBuilder"
import type CaseQueryBuilder from "../CaseQueryBuilder"
import type CountQueryBuilder from "../CountQueryBuilder"

export type SelectCaseFunction<T extends EntityTarget> = (
    (queryBuilder: CaseQueryBuilder<T>) => void
)

export type SelectPropertyType<T extends EntityTarget> = (
    SelectPropertyKey<InstanceType<T>> |
    CaseQueryBuilder<T>
)

export type SelectPropertiesOptions<T extends EntityTarget> = (
    SelectPropertyKey<InstanceType<T>> |
    SelectCaseFunction<T>
)

export type SelectCountFunction<T extends EntityTarget> = (
    (queryBuilder: CountQueryBuilder<T>) => void
)