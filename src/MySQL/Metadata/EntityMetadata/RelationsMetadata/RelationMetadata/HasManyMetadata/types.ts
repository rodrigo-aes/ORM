import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../types/General"

export type HasManyRelatedGetter = () => EntityTarget

export interface HasManyOptions extends RelationOptions {
    foreignKey: string
    related: HasManyRelatedGetter
    scope?: any
}