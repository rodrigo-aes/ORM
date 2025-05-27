import WhereQueryBuilder from "./WhereQueryBuilder"
import OnQueryBuilder from "./OnQueryBuilder"
import CaseQueryBuilder, {
    Case,
    type CaseQueryOptions,
} from "./CaseQueryBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    ConditionalQueryOptions,
    AndQueryOptions,
    OrQueryOptions
} from "./types"
import type { RelationMetadataType } from "../../Metadata"

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
        relation: RelationMetadataType,
        parentAlias: string,
        alias: string,
        target: T,
        options?: ConditionalQueryOptions<InstanceType<T>>,
    ): OnQueryBuilder<T> {
        return new OnQueryBuilder(
            relation,
            parentAlias,
            alias,
            target,
            options
        )
    }

    // ------------------------------------------------------------------------

    public static case<T extends EntityTarget>(
        target: T,
        options: CaseQueryOptions<InstanceType<T>>,
        as?: string,
        alias?: string
    ): CaseQueryBuilder<T> {
        return new CaseQueryBuilder(
            target,
            options,
            as,
            alias
        )
    }
}

export {
    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions,

    Case,
    type CaseQueryOptions
}