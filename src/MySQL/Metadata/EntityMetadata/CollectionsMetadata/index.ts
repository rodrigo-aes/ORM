import { Collection } from "../../../BaseEntity"
import CollectionsMetadataHandler from "./CollectionsMetadataHandler"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"

export default class CollectionsMetadata<
    T extends EntityTarget | PolymorphicEntityTarget = any,
    CollectionType extends typeof Collection<InstanceType<T>> = any
> extends Array<CollectionType> {
    public default: typeof Collection = Collection

    constructor(public target: T, ...collections: CollectionType[]) {
        super(...collections)

        this.register()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public search(search: string): CollectionType | undefined {
        return this.find(({ name, alias }) => [name, alias].includes(search))
    }

    // ------------------------------------------------------------------------

    public setDefault(collection: typeof Collection): void {
        this.default = collection
    }

    // ------------------------------------------------------------------------

    public addCollections(...collections: (typeof Collection)[]): void {
        this.push(...collections as CollectionType[])
    }

    // Privates ---------------------------------------------------------------
    private register() {
        Reflect.defineMetadata('collections', this, this.target)
    }

    // Static Methods =========================================================
    // Publics ================================================================
    public static find<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T
    ): CollectionsMetadata<T> | undefined {
        return Reflect.getOwnMetadata('collections', target)
    }

    // ------------------------------------------------------------------------

    public static build<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T
    ): CollectionsMetadata<T> {
        return new CollectionsMetadata(target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T
    ): CollectionsMetadata<T> {
        return this.find(target) ?? this.build(target)
    }
}

export {
    CollectionsMetadataHandler
}