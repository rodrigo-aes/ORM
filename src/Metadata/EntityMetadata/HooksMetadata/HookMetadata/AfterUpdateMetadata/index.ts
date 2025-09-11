import HookMetadata from "../HookMetadata"

export default class AfterUpdateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-update' {
        return 'after-update'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<Entity extends object>(entity: Entity) {
        return this.hookFn(entity)
    }
}