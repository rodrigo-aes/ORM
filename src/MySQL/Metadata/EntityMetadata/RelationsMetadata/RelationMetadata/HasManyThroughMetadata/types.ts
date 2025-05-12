import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../../types/General"

export type HasManyThroughRelatedGetter = () => EntityTarget
export type HasManyThroughGetter = () => EntityTarget

export interface HasManyThroughOptions extends RelationOptions {
    foreignKey: string
    throughForeignKey: string
    related: HasManyThroughRelatedGetter
    through: HasManyThroughGetter
    scope?: any
}