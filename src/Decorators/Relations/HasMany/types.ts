import type {
    HasManyOptions as HasManyMetadataOptions
} from "../../../Metadata"

export type HasManyOptions = string | Omit<HasManyMetadataOptions, (
    'related' |
    'name'
)>