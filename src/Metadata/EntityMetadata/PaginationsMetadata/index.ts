import CollectionsMetadata from "../CollectionsMetadata"
import { Pagination } from "../../../BaseEntity"

// Handlers
import PaginationMetadataHandler from "./PaginationMetadataHandler"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

export default class PaginationsMetadata<
    T extends EntityTarget | PolymorphicEntityTarget = any,
    PaginationType extends typeof Pagination<InstanceType<T>> = any
> extends CollectionsMetadata<T, PaginationType> {
    public override default: typeof Pagination = Pagination

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected override register() {
        Reflect.defineMetadata('paginations', this, this.target)
    }

    // Static Methods =========================================================
    // Publics ================================================================
    public static find<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T
    ): PaginationsMetadata<T> | undefined {
        return Reflect.getOwnMetadata('paginations', target)
    }

    // ------------------------------------------------------------------------

    public static build<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T
    ): PaginationsMetadata<T> {
        return new PaginationsMetadata(target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T
    ): PaginationsMetadata<T> {
        return this.find(target) ?? this.build(target)
    }
}

export {
    PaginationMetadataHandler
}