import MetadataMap from "../../MetadataMap"
import { Collection } from "../../../BaseEntity"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget,
    CollectionTarget
} from "../../../types"

import type { ComputedPropertyFunction, ComputedPropertiesJSON } from "./types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class ComputedPropertiesMetadata<
    T extends EntityTarget | PolymorphicEntityTarget = any,
    Target extends T | CollectionTarget = any
> extends MetadataMap<
    string, ComputedPropertyFunction<T>
> {
    protected static override readonly KEY: string = 'connections-metadata'
    protected readonly KEY: string = ComputedPropertiesMetadata.KEY
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_CONNECTION'
    )

    constructor(public target: Target) {
        super(target)
        this.init()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public assign(target: InstanceType<T> | Collection<InstanceType<T>>): (
        Promise<void>
    ) {
        return target instanceof Collection
            ? this.assignCollection(target)
            : this.assignEntity(target)
    }

    // Privates ---------------------------------------------------------------
    private async assignEntity(entity: InstanceType<T>): Promise<void> {
        for (const [prop, fn] of Array.from(this.entries())) entity[
            prop as keyof InstanceType<T>
        ] = await fn(undefined, entity)
    }

    // ------------------------------------------------------------------------

    private async assignCollection(collection: Collection<InstanceType<T>>) {
        for (const [prop, fn] of Array.from(this.entries())) {
            let value
            for (const entity of collection) value = await fn(value, entity)

            Object.assign(collection, { [prop]: value })
        }
    }
}

export {
    type ComputedPropertyFunction,
    type ComputedPropertiesJSON
}