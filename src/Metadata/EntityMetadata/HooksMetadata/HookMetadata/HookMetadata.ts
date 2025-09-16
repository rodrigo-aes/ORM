import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"
import type { HookType, HookFunction, HookMetadataJSON } from "./types"

export default abstract class HookMetadata {
    constructor(
        public target: EntityTarget | PolymorphicEntityTarget,
        public method: string
    ) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public abstract get type(): HookType

    // ------------------------------------------------------------------------

    public get hookFn(): HookFunction {
        return this.target[this.method as keyof EntityTarget]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract call(...args: any[]): void | Promise<void>

    // ------------------------------------------------------------------------

    public toJSON(): HookMetadataJSON {
        return {
            type: this.type,
            method: this.method,
            hookFn: this.hookFn
        }
    }
}