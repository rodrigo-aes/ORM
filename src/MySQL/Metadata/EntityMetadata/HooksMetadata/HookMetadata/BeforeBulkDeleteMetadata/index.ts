import HookMetadata from "../HookMetadata"

// Types
import type { ConditionalQueryOptions } from "../../../../../QueryBuilder"

export default class BeforeBulkDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-bulk-delete' {
        return 'before-bulk-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<Entity extends object>(
        where: ConditionalQueryOptions<Entity>
    ) {
        return this.hookFn(where)
    }
}