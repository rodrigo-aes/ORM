import Collection from ".."

// Types
import type { EntityTarget } from "../../../../../types/General"
import type { RelationMetadataType } from "../../../../Metadata"

export default class RelationCollection<
    Entity extends object,
    R extends RelationMetadataType
> extends Collection<Entity> {
    constructor(
        public relation: R,
        ...entities: Entity[]
    ) {
        super(...entities)
    }
}