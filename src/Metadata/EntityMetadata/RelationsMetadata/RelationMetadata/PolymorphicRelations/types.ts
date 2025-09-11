import type { EntityTarget } from "../../../../../types/General"
import type { RelationOptions } from "../types"

// Polymorphic Parent =========================================================
export type PolymorphicParentRelatedGetter = () => EntityTarget[]

export interface PolymorphicParentOptions extends RelationOptions {
    related: PolymorphicParentRelatedGetter,
    foreignKey: string
    typeKey?: string
    scope?: any
}

// Polymorphic Child ==========================================================
export type PolymorphicChildRelatedGetter = () => EntityTarget

export interface PolymorphicChildOptions extends RelationOptions {
    related: PolymorphicChildRelatedGetter
    foreignKey: string
    typeKey?: string
    scope?: any
}