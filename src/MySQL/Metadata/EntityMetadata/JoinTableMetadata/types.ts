import type { EntityTarget } from "../../../../types/General"
import type { ForeignKeyActionListener } from "../ColumnMetadata"

export type JoinTableRelatedTarget = EntityTarget | (() => EntityTarget)
export type JoinTableRelated<T = JoinTableRelatedTarget> = {
    target: T,
    options?: {
        onDelete?: ForeignKeyActionListener
        onUpdate?: ForeignKeyActionListener
    }
}

export type JoinTableRelatedsGetter = () => (
    [JoinTableRelated, JoinTableRelated]
)