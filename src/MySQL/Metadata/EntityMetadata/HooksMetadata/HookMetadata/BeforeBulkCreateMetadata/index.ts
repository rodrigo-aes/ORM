import HookMetadata from "../HookMetadata"

// Types
import type { CreationAttributes } from "../../../../../SQLBuilders"

export default class BeforeBulkCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-bulk-create' {
        return 'before-bulk-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<Entity extends object>(
        attributes: CreationAttributes<Entity>[]
    ) {
        return this.hookFn(attributes)
    }
}