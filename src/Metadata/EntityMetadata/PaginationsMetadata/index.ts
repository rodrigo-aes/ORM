import CollectionsMetadata from "../CollectionsMetadata"
import { Pagination } from "../../../BaseEntity"

// Handlers
import PaginationMetadataHandler from "./PaginationMetadataHandler"

// Types
import type { Target } from "../../../types"

export default class PaginationsMetadata<
    T extends Target = Target,
    P extends typeof Pagination<InstanceType<T>> = any
> extends CollectionsMetadata<T, P> {
    protected static override readonly KEY: string = 'paginations-metadata'

    protected readonly KEY: string = PaginationsMetadata.KEY
    public override default: typeof Pagination = Pagination
}

export {
    PaginationMetadataHandler
}