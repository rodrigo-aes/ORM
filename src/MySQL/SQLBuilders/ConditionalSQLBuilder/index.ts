import WhereSQLBuilder from "./WhereSQLBuilder"
import OnSQLBuilder from "./OnSQLBuilder"
import { Op } from "./Operator"
import CaseSQLBuilder, {
    Case,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
} from "./CaseSQLBuilder"

import {
    Exists,
    Cross,

    type ExistsQueryOptions,
    type CrossExistsQueryOptions,
} from "./ExistsSQLBuilder"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../../types/General"
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
    public static where<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T,
        options: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ): WhereSQLBuilder<T> {
        return new WhereSQLBuilder(target, options, alias)
    }

    // ------------------------------------------------------------------------

    public static on<T extends EntityTarget | PolymorphicEntityTarget>(
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

    public static case<T extends EntityTarget | PolymorphicEntityTarget>(
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
    Op,

    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions,

    Case,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,

    Exists,
    Cross,
    type ExistsQueryOptions,
    type CrossExistsQueryOptions,

}