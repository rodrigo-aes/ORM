import BeforeUpdateMetadata from "../BeforeUpdateMetadata"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../../types/General"
import type { HookFunction } from "../types"

export default class UpdatedTimestampMetadata extends BeforeUpdateMetadata {
    constructor(
        public target: EntityTarget | PolymorphicEntityTarget
    ) {
        super(target, '')
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-update' {
        return 'before-update'
    }

    // ------------------------------------------------------------------------

    public override get hookFn(): HookFunction {
        throw new Error
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(attributes: any) {
        attributes.updatedAt = new Date
    }
}