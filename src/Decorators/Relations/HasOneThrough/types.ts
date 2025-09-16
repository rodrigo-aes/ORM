import type {
    HasOneThroughOptions as HasOneThroughMetadataOptions
} from "../../../Metadata"

export type HasOneThroughOptions = Omit<HasOneThroughMetadataOptions, (
    'name' |
    'related' |
    'through'
)>

