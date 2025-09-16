import type {
    BelongsToThroughOptions as BelongsToThroughMetadataOptions
} from "../../../Metadata"

export type BelongsToThroughOptions = Omit<BelongsToThroughMetadataOptions, (
    'name' |
    'related' |
    'through'
)>