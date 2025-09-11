import type { BelongsToThroughOptions } from "../../../Metadata"

export type RelationOptions = Omit<BelongsToThroughOptions, (
    'name' |
    'related' |
    'through'
)>