import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../types/General"

export type BelongsToRelatedGetter = () => EntityTarget | EntityTarget[]

export interface BelongToOptions extends RelationOptions {
    related: BelongsToRelatedGetter
    foreignKey: string
    scope?: any
}