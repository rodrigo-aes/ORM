import Collection from ".."

// Types
import type { EntityTarget } from "../../../../../types/General"
import type { RelationMetadataType } from "../../../../Metadata"

export default class RelationCollection<
    T extends EntityTarget,
    Relation extends RelationMetadataType
> extends Collection<T> {
    constructor(
        protected relation: Relation,
        ...entities: InstanceType<T>[]
    ) {
        super(...entities)
    }
}