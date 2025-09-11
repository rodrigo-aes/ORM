import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"
import type { HookType, HookFunction } from "./types"

export default abstract class HookMetadata {
    constructor(
        public target: EntityTarget | PolymorphicEntityTarget,
        public propertName: string
    ) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public abstract get type(): HookType

    // ------------------------------------------------------------------------

    public get hookFn(): HookFunction {
        return this.target[this.propertName as keyof EntityTarget]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract call(...args: any[]): void | Promise<void>
}