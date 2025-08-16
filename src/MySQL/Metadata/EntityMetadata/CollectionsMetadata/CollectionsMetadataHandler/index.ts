import { Collection } from "../../../../BaseEntity"
import CollectionsMetadata from ".."
import TempMetadata from "../../../TempMetadata"
import type {
    EntityTarget,
    EntityUnionTarget
} from "../../../../../types/General"

export default class CollectionsMetadataHandler {
    public static loadCollection(target: EntityTarget | EntityUnionTarget): (
        typeof Collection
    ) {
        return TempMetadata.getCollection(target)
            ?? CollectionsMetadata.find(target)?.default
            ?? Collection
    }

    // ------------------------------------------------------------------------

    public static build<T extends EntityTarget | EntityUnionTarget>(
        target: T,
        entities: InstanceType<T>[]
    ): Collection<InstanceType<T>> {
        return new (this.loadCollection(target))(...entities)
    }
}