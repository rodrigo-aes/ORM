// Types
import type { EntityTarget } from "../../../../../types/General"
import type { RelationOptions, RelationMetadataTypeName } from "./types"

export default abstract class RelationMetadata {
    public name!: string

    constructor(public target: EntityTarget, options: RelationOptions) {
        if (options) Object.assign(this, options)
    }

    public abstract get relatedTarget(): EntityTarget

    public abstract toJSON(): any

    public get type(): RelationMetadataTypeName {
        return this.constructor.name.replace('Metadata', '') as (
            RelationMetadataTypeName
        )
    }
}