import type {
    BelongsToManyOptions as BelongsToManyMetadataOptions
} from "../../../Metadata"

export type BelongsToManyOptions = Omit<BelongsToManyMetadataOptions, (
    'name' |
    'related'
)>