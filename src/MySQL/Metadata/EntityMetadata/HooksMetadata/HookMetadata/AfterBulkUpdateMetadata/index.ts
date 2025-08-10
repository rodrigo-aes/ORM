import HookMetadata from "../HookMetadata"

import type { ResultSetHeader } from "mysql2"
import type { ConditionalQueryOptions } from "../../../../../QueryBuilder"

export default class AfterBulkUpdateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-bulk-update' {
        return 'after-bulk-update'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<Entity extends object>(
        where: ConditionalQueryOptions<Entity> | undefined,
        result: ResultSetHeader
    ) {
        return this.hookFn(where, result)
    }
}