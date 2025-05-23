// Types
import type { EntityTarget } from "../../../../../types/General"
import type { RelationOptions } from "./types"

export default abstract class RelationMetadata {
    public name!: string

    constructor(public target: EntityTarget, options: RelationOptions) {
        if (options) Object.assign(this, options)
    }

    public abstract get relatedTarget(): EntityTarget
}