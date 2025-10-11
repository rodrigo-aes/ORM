import MetadataArray from "../../MetadataArray"

// Types
import type { EntityTarget, Constructor } from "../../../types"
import type { Trigger } from "../../../Triggers"

// Exceptions
import { type MetadataErrorCode } from "../../../Errors"

export default class TriggersMetadata extends MetadataArray<
    Constructor<Trigger>
> {
    protected static readonly KEY: string = 'triggers-metadata'
    protected readonly KEY: string = TriggersMetadata.KEY

    protected readonly SEARCH_KEYS: never[] = []
    protected readonly UNIQUE_MERGE_KEYS: ('name')[] = ['name']
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = undefined

    constructor(
        public target: EntityTarget,
        ...triggers: Constructor<Trigger>[]
    ) {
        super(target, ...triggers)
        this.init()
    }
}