import { Collection } from "../../../../BaseEntity"
import CollectionsMetadata from ".."
import TempMetadata from "../../../TempMetadata"
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"

export default class CollectionsMetadataHandler {
    public static loadCollection(target: EntityTarget | PolymorphicEntityTarget): (
        typeof Collection
    ) {
        return TempMetadata.getCollection(target)
            ?? CollectionsMetadata.find(target)?.default
            ?? Collection
    }

    // ------------------------------------------------------------------------

    public static build<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T,
        entities: InstanceType<T>[]
    ): Collection<InstanceType<T>> {
        return new (this.loadCollection(target))(...entities)
    }
}