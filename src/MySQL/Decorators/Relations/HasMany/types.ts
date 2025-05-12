import type { HasManyOptions } from "../../../Metadata"

export type RelationOptions = string | Omit<HasManyOptions, (
    'related' |
    'name'
)>