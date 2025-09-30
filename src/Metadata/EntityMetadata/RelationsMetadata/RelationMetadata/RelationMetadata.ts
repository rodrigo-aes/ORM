// Types
import type { EntityTarget, PolymorphicEntityTarget, Target } from "../../../../types"
import type { RelationOptions, RelationMetadataName } from "./types"

export default abstract class RelationMetadata {
    constructor(public target: EntityTarget, public name: string) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public abstract get relatedTarget(): Target

    // ------------------------------------------------------------------------

    public get type(): RelationMetadataName {
        return this.constructor.name.replace('Metadata', '') as (
            RelationMetadataName
        )
    }

    // instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract toJSON(): any
}