import type { BelongToOptions } from "../../../Metadata"

export type RelationOptions = Omit<BelongToOptions, (
    'name' |
    'related'
)>