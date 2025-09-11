import { AsyncLocalStorage } from "async_hooks"
// Types
import { EntityToJSONProccessMap } from "./types"

class EntityToJSONProcessMetadata extends AsyncLocalStorage<
    EntityToJSONProccessMap
> {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get addedEntities(): Set<string> {
        return this.getStore()!.addedEntities
    }

    // ------------------------------------------------------------------------

    public get initialized(): boolean {
        return !!this.getStore()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public apply(proccess: () => any) {
        return this.run(this.initialStore(), proccess)
    }

    // ------------------------------------------------------------------------

    public shouldAdd(entityName: string): boolean {
        if (this.addedEntities.has(entityName)) return false

        this.addedEntities.add(entityName)
        return true
    }

    // Privates ---------------------------------------------------------------
    private initialStore(): EntityToJSONProccessMap {
        return {
            addedEntities: new Set
        }
    }
}

export default new EntityToJSONProcessMetadata