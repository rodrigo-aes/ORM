import HookMetadata from "../HookMetadata"

// Types
import type BaseEntity from "../../../../../BaseEntity"
import type BaseEntityUnion from "../../../../../BaseEntityUnion"
import type {
    RawData,
    MySQL2RawData
} from "../../../../../Handlers/MySQL2RawDataHandler"

export default class AfterBulkCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-bulk-create' {
        return 'after-bulk-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends (
        (BaseEntity | BaseEntityUnion<any>) |
        RawData<any> |
        MySQL2RawData
    )>(result: T[]): void | Promise<void> {
        return this.hookFn(result)
    }
}