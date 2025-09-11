import HookMetadata from "../HookMetadata"

export default class BeforeSyncMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-sync' {
        return 'before-sync'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(): void | Promise<void> {
        return this.hookFn()
    }
}