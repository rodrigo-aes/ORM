import type {
    HasOneOptions as HasOneMetadataOptions
} from "../../../Metadata"

export type HasOneOptions = string | Omit<HasOneMetadataOptions, (
    'related' |
    'name'
)>