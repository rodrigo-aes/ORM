import HookMetadata from "../HookMetadata"

// Types
import type BaseEntity from "../../../../../BaseEntity"
import type BasePolymorphicEntity from "../../../../../BasePolymorphicEntity"

export default class AfterCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-create' {
        return 'after-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends (
        (BaseEntity | BasePolymorphicEntity<any>)
    )>(result: T): void | Promise<void> {
        return this.hookFn(result)
    }
}