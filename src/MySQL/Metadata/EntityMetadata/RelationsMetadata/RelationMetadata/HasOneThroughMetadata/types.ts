import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../../types/General"

export type HasOneThroughRelatedGetter = () => EntityTarget
export type HasOneThroughGetter = () => EntityTarget

export interface HasOneThroughOptions extends RelationOptions {
    foreignKey: string
    throughForeignKey: string
    related: HasOneThroughRelatedGetter
    through: HasOneThroughGetter
    scope?: any
}