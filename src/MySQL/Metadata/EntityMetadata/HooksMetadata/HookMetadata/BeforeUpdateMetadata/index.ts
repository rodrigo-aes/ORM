import HookMetadata from "../HookMetadata"

// Types
import type {
    ConditionalQueryOptions,
    UpdateAttributes,
} from "../../../../../SQLBuilders"

export default class BeforeUpdateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-update' {
        return 'before-update'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<Entity extends object>(
        attributes: Entity | UpdateAttributes<Entity>,
        where?: ConditionalQueryOptions<Entity>
    ) {
        return this.hookFn(attributes, where)
    }
}