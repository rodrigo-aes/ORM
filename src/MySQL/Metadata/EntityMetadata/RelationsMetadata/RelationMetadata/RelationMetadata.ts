// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../../../../types/General"
import type { RelationOptions, RelationMetadataName } from "./types"

export default abstract class RelationMetadata {
    public name!: string

    constructor(public target: EntityTarget, options: RelationOptions) {
        if (options) Object.assign(this, options)
    }

    public abstract get relatedTarget(): EntityTarget | PolymorphicEntityTarget

    public abstract toJSON(): any

    public get type(): RelationMetadataName {
        return this.constructor.name.replace('Metadata', '') as (
            RelationMetadataName
        )
    }
}