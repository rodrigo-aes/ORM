import { EntityMetadata } from "../../../Metadata"

// Query Handlers
import AndQueryBuilder from "../AndQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type {
    AndQueryOptions,
    OrQueryOptions
} from "../../ConditionalSQLBuilder"

import type { WhereQueryFunction } from "./types"

import type { EntityProperties, EntityPropertiesKeys } from "../../types"
import type { CompatibleOperators, OperatorType } from "../OperatorQueryBuilder"

export default class WhereQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private currentAnd!: AndQueryBuilder<T>
    private orOpts?: AndQueryBuilder<T>[]

    constructor(
        public target: T,
        public alias?: string,
    ) {
        this.metadata = this.loadMetadata()
        this.addAndClause()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------  
    public where<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): this {
        this.currentAnd.where(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    public and = this.where

    // ------------------------------------------------------------------------

    public or(): this {
        if (!this.orOpts) this.orOpts = []
        this.orOpts.push(this.currentAnd)

        this.addAndClause()
        this.orOpts.push(this.currentAnd)

        return this
    }

    // ------------------------------------------------------------------------

    public orWhere<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ) {
        if (!this.orOpts) this.orOpts = []
        this.orOpts.push(this.currentAnd)

        this.addAndClause()
        this.currentAnd.where(propertie, conditional, value)
        this.orOpts.push(this.currentAnd)

        return this
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): (
        AndQueryOptions<InstanceType<T>> |
        OrQueryOptions<InstanceType<T>>
    ) {
        if (this.orOpts) return this.orOpts.map(opt => opt.toQueryOptions())
        return this.currentAnd.toQueryOptions()
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private addAndClause(): void {
        this.currentAnd = new AndQueryBuilder(
            this.target,
            this.alias
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static where<
        T extends EntityTarget,
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        target: T,
        alias: string | undefined,
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ) {
        return new WhereQueryBuilder(
            target,
            alias
        )
            .where(
                propertie,
                conditional,
                value
            )
    }
}

export {
    type WhereQueryFunction
}