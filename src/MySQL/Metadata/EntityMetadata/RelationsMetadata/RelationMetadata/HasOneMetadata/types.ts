import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../../types/General"

export type HasOneRelatedGetter = () => EntityTarget

export interface HasOneOptions extends RelationOptions {
    foreignKey: string
    related: HasOneRelatedGetter
    scope?: any
}