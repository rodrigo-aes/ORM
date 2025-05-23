import type { EntityTarget } from "../../../../../../types/General"
import type { RelationOptions } from "../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"

export type BelongsToThroughRelatedGetter = () => EntityTarget
export type BelongsToThroughGetter = () => EntityTarget

export interface BelongsToThroughOptions extends RelationOptions {
    related: BelongsToThroughRelatedGetter,
    through: BelongsToThroughGetter
    foreignKey: string
    throughForeignKey: string
    scope?: any
}

export type ThroughForeignKeysMap = {
    [key: string]: ColumnMetadata
}