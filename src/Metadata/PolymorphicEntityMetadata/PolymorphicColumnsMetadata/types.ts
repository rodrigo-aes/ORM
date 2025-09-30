import type { EntityTarget } from "../../../types"

export type CombinedColumnOptions = {
    target: EntityTarget,
    column: string
}[]

export type CombinedColumns = {
    [Key: string]: CombinedColumnOptions
}

export type MergeSourceColumnsConfig = {
    internalName?: string,
    shouldVerifyDataType?: boolean,
    shouldAssignCommonProperties?: boolean
}