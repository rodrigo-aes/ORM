import HookMetadata from "../HookMetadata"

// Types
import type { FindQueryOptions } from "../../../../../SQLBuilders"

export default class BeforeFindMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-find' {
        return 'before-find'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(options: FindQueryOptions<any>): void | Promise<void> {
        return this.hookFn(options)
    }
}