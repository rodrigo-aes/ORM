import type { HasOneThroughOptions } from "../../../Metadata"

export type RelationOptions = Omit<HasOneThroughOptions, (
    'name' |
    'related' |
    'through'
)>

