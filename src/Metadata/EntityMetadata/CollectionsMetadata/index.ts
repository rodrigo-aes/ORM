import MetadataArray from "../../MetadataArray"

import { Collection } from "../../../BaseEntity"
import CollectionsMetadataHandler from "./CollectionsMetadataHandler"

// Types
import type { Target } from "../../../types"
import type { CollectionsMetadataJSON } from "./types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class CollectionsMetadata<
    T extends Target = Target,
    C extends typeof Collection<InstanceType<T>> = any
> extends MetadataArray<C> {
    protected static override readonly KEY: string = 'collections-metadata'

    protected readonly KEY: string = CollectionsMetadata.KEY
    protected readonly SEARCH_KEYS: (keyof C | 'name')[] = [
        'name', 'alias'
    ]
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_COLLECTION'
    )

    public default: typeof Collection = Collection

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public get [Symbol.species](): typeof Array {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public setDefault(collection: typeof Collection): void {
        this.default = collection
    }

    // ------------------------------------------------------------------------

    public override toJSON(): CollectionsMetadataJSON {
        return {
            default: this.default,
            collections: super.toJSON()
        }
    }
}

export {
    CollectionsMetadataHandler,

    type CollectionsMetadataJSON
}