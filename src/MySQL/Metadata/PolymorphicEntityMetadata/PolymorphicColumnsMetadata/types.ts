import type { EntityTarget } from "../../../../types/General"

export type CombinedColumnOptions = {
    entity: EntityTarget,
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