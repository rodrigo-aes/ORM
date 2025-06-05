import type { EntityTarget } from "../../../../types/General"

import type { SelectPropertyKey } from "../../SelectSQLBuilder"
import type CaseQueryHandler from "../CaseQueryHandler"
import type CountQueryHandler from "../CountQueryHandler"

export type SelectCaseFunction<T extends EntityTarget> = (
    (queryBuilder: CaseQueryHandler<T>) => void
)

export type SelectPropertyType<T extends EntityTarget> = (
    SelectPropertyKey<InstanceType<T>> |
    CaseQueryHandler<T>
)

export type SelectPropertiesOptions<T extends EntityTarget> = (
    SelectPropertyKey<InstanceType<T>> |
    SelectCaseFunction<T>
)

export type SelectCountFunction<T extends EntityTarget> = (
    (queryBuilder: CountQueryHandler<T>) => void
)