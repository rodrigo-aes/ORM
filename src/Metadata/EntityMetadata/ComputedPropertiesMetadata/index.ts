// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget,
    CollectionTarget
} from "../../../types/General"

import { Collection } from "../../../BaseEntity"
import type { ComputedPropertyFunction } from "./types"

export default class ComputedPropertiesMetadata<
    T extends EntityTarget | PolymorphicEntityTarget = any,
    Target extends T | CollectionTarget = any
> extends Map<
    keyof InstanceType<Target>, ComputedPropertyFunction<T>
> {
    constructor(public target: Target) {
        super()

        this.register()
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
    private register() {
        Reflect.defineMetadata('computed-properties', this, this.target)
    }

    // ------------------------------------------------------------------------

    private async assignEntity(entity: InstanceType<T>): Promise<void> {
        for (const [prop, fn] of this.entries()) entity[prop as (
            keyof InstanceType<T>
        )] = await fn(undefined, entity)
    }

    // ------------------------------------------------------------------------

    private async assignCollection(collection: Collection<InstanceType<T>>): (
        Promise<void>
    ) {
        for (const [prop, fn] of this.entries()) {
            let value
            for (const entity of collection) value = await fn(value, entity)

            Object.assign(collection, { [prop]: value })
        }

    }

    // Static Methods =========================================================
    // Publics ================================================================
    public static find(
        target: EntityTarget | PolymorphicEntityTarget | CollectionTarget
    ): ComputedPropertiesMetadata | undefined {
        return Reflect.getOwnMetadata('computed-properties', target)
    }

    // ------------------------------------------------------------------------

    public static build(
        target: EntityTarget | PolymorphicEntityTarget | CollectionTarget
    ) {
        return new ComputedPropertiesMetadata(target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(
        target: EntityTarget | PolymorphicEntityTarget | CollectionTarget
    ) {
        return this.find(target) ?? this.build(target)
    }
}

export {
    type ComputedPropertyFunction
}