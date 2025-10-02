import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../../types"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { RelationOptions } from "../types"

// Polymorphic Parent =========================================================
export type PolymorphicParentRelatedGetter = () => (
    EntityTarget[] | PolymorphicEntityTarget
)

export interface PolymorphicParentOptions extends RelationOptions {
    related: PolymorphicParentRelatedGetter,
    foreignKey: string
    typeKey?: string
    scope?: ConditionalQueryOptions<any>
}

// Polymorphic Child ==========================================================
export type PolymorphicChildRelatedGetter = () => EntityTarget

export interface PolymorphicChildOptions extends RelationOptions {
    related: PolymorphicChildRelatedGetter
    foreignKey: string
    typeKey?: string
    scope?: ConditionalQueryOptions<any>
}