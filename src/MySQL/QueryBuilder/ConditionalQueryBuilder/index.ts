import WhereQueryBuilder from "./WhereQueryBuilder"
import OnQueryBuilder from "./OnQueryBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    ConditionalQueryOptions,
    AndQueryOptions,
    OrQueryOptions
} from "./types"

export default class ConditionalQueryBuilder {
    private constructor() {
        throw new Error
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static where<T extends EntityTarget>(
        target: T,
        options: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ): WhereQueryBuilder<T> {
        return new WhereQueryBuilder(target, options, alias)
    }

    // ------------------------------------------------------------------------

    public static on<T extends EntityTarget>(
        target: T,
        options: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ): OnQueryBuilder<T> {
        return new OnQueryBuilder(target, options, alias)
    }
}

export {
    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions
}