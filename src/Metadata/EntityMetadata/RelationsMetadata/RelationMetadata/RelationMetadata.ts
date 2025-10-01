// Types
import type { Target } from "../../../../types"
import type { RelationType } from "./types"

export default abstract class RelationMetadata {
    constructor(public target: Target, public name: string) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public abstract get relatedTarget(): Target

    // ------------------------------------------------------------------------

    public get type(): RelationType {
        return this.constructor.name.replace('Metadata', '') as (
            RelationType
        )
    }

    // instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract toJSON(): any
}