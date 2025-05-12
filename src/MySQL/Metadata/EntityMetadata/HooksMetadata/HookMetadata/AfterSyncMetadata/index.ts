import HookMetadata from "../HookMetadata"

export default class AfterSyncMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-sync' {
        return 'after-sync'
    }
}