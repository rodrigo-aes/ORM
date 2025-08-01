import WhereSQLBuilder from "./WhereSQLBuilder"
import OnSQLBuilder from "./OnSQLBuilder"
import CaseSQLBuilder, {
    Case,
    type CaseQueryOptions,
} from "./CaseSQLBuilder"

import {
    Exists,
    ExistsQueryOptions
} from "./ExistsSQLBuilder"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type {
    ConditionalQueryOptions,
    AndQueryOptions,
    OrQueryOptions
} from "./types"
import type { RelationMetadataType } from "../../Metadata"

export default class ConditionalSQLBuilder {
    private constructor() {
        throw new Error
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static where<T extends EntityTarget | UnionEntityTarget>(
        target: T,
        options: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ): WhereSQLBuilder<T> {
        return new WhereSQLBuilder(target, options, alias)
    }

    // ------------------------------------------------------------------------

    public static on<T extends EntityTarget | UnionEntityTarget>(
        relation: RelationMetadataType,
        parentAlias: string,
        alias: string,
        target: T,
        options?: ConditionalQueryOptions<InstanceType<T>>,
    ): OnSQLBuilder<T> {
        return new OnSQLBuilder(
            relation,
            parentAlias,
            alias,
            target,
            options
        )
    }

    // ------------------------------------------------------------------------

    public static case<T extends EntityTarget | UnionEntityTarget>(
        target: T,
        options: CaseQueryOptions<InstanceType<T>>,
        as?: string,
        alias?: string
    ): CaseSQLBuilder<T> {
        return new CaseSQLBuilder(
            target,
            options,
            as,
            alias
        )
    }
}

export {
    WhereSQLBuilder,
    OnSQLBuilder,

    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions,

    Case,
    type CaseQueryOptions,

    Exists,
    type ExistsQueryOptions
}