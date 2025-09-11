import HookMetadata from "../HookMetadata"

import type { DeleteResult } from "../../../../../Handlers"

export default class AfterDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-delete' {
        return 'after-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<Entity extends object>(entity: Entity, result: DeleteResult) {
        return this.hookFn(entity, result)
    }
}