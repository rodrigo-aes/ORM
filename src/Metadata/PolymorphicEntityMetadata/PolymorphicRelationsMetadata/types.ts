import type { EntityTarget } from "../../../types"

export type IncludeRelationOptions = {
    target: EntityTarget,
    relation: string
}[]

export type IncludedRelations = {
    [Key: string]: IncludeRelationOptions
}