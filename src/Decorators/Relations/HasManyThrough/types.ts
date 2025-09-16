import type {
    HasManyThroughOptions as HasManyThroughMetdataOptions
} from "../../../Metadata"

export type HasManyThroughOptions = Omit<HasManyThroughMetdataOptions, (
    'name' |
    'related' |
    'through'
)>