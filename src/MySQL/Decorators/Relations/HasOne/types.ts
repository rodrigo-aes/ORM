import type { HasOneOptions } from "../../../Metadata"

export type RelationOptions = string | Omit<HasOneOptions, (
    'related' |
    'name'
)>