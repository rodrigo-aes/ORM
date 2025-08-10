import HookMetadata from "../HookMetadata"

export default class BeforeDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-delete' {
        return 'before-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<Entity extends object>(entity: Entity) {
        return this.hookFn(entity)
    }
}