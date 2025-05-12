import BelongsToMetadata from "../../BelongsToMetadata"

// Types
import type { EntityTarget } from "../../../../../../../types/General"
import type { PolymorphicParentOptions } from "../types"
import type { RelatedEntitiesMap } from "../../types"

export default class PolymorphicBelongsToMetadata extends BelongsToMetadata {
    public typeKey: string

    constructor(
        target: EntityTarget,
        { typeKey, ...options }: PolymorphicParentOptions
    ) {
        super(target, options)
        this.typeKey = typeKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public override get entity(): RelatedEntitiesMap {
        return this.getEntities() as RelatedEntitiesMap
    }
}