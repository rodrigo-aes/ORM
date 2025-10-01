import type { EntityTarget } from "../../../types"

export type IncludeColumnOptions = {
    target: EntityTarget,
    column: string
}[]

export type IncludedColumns = {
    [Key: string]: IncludeColumnOptions
}