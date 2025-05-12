import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../../types/General"
import type { ForeignKeyActionListener } from "../../../ColumnsMetadata"

export type BelongsToManyRelatedGetter = () => EntityTarget

export interface BelongsToManyOptions extends RelationOptions {
    related: BelongsToManyRelatedGetter
    joinTable?: string
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
}