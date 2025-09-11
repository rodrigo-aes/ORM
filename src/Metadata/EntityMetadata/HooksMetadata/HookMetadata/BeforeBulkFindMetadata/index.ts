import HookMetadata from "../HookMetadata"

// Types
import type { FindQueryOptions } from "../../../../../SQLBuilders"

export default class BeforeBulkFindMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-bulk-find' {
        return 'before-bulk-find'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(options: FindQueryOptions<any>): void | Promise<void> {
        return this.hookFn(options)
    }
}