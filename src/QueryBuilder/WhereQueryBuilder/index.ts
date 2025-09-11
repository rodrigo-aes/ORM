import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../Metadata"

// Query Handlers
import AndQueryBuilder from "../AndQueryBuilder"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type {
    AndQueryOptions,
    OrQueryOptions,
    EntityProperties,
    EntityPropertiesKeys
} from "../../SQLBuilders"

import type { WhereQueryHandler } from "../types"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

export default class WhereQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    private currentAnd!: AndQueryBuilder<T>
    private orOpts?: AndQueryBuilder<T>[]

    constructor(
        public target: T,
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
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

    public whereExists<
        Source extends (
            EntityTarget |
            PolymorphicEntityTarget |
            WhereQueryHandler<T>
        )
    >(
        exists: Source,
        conditional: typeof exists extends (
            EntityTarget |
            PolymorphicEntityTarget
        )
            ? WhereQueryHandler<Source>
            : never
    ): this {
        this.currentAnd.whereExists(exists, conditional)

        return this
    }

    // ------------------------------------------------------------------------

    public and = this.where

    // ------------------------------------------------------------------------

    public andExists = this.whereExists

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
        return new WhereQueryBuilder(target, alias)
            .where(
                propertie,
                conditional,
                value
            )
    }
}