import type { EntityTarget } from "../../../../../types/General"
import type { HookType, HookFunction } from "./types"

export default abstract class HookMetadata {
    constructor(
        public target: EntityTarget,
        public propertName: string
    ) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public abstract get type(): HookType

    public get propertyFn(): HookFunction {
        return this.target[this.propertName as keyof EntityTarget]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(...args: any[]): void | Promise<void> {
        return this.propertyFn(...args)
    }
}