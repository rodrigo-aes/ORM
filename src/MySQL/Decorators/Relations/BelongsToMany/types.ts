import type { BelongsToManyOptions } from "../../../Metadata"

export type RelationOptions = Omit<BelongsToManyOptions, (
    'name' |
    'related'
)>