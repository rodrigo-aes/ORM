import type { HasManyThroughOptions } from "../../../Metadata"

export type RelationOptions = Omit<HasManyThroughOptions, (
    'name' |
    'related' |
    'through'
)>