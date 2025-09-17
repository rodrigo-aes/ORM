import { MetadataHandler } from "../../Metadata"

// Query Handlers
import AndQueryBuilder from "../AndQueryBuilder"

// Types
import type {
    Target,
    TargetMetadata
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

/**
 * Build a `WHERE/ON` conditional options 
 */
export default class ConditionalQueryHandler<T extends Target> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private currentAnd!: AndQueryBuilder<T>

    /** @internal */
    private _orOptions?: AndQueryBuilder<T>[]

    /** @internal */
    constructor(
        /** @internal */
        public target: T,

        /** @internal */
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
        this.addAndClause()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get orOptions(): AndQueryBuilder<T>[] {
        if (!this._orOptions) this._orOptions = []
        return this._orOptions
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------  
    /**
     * Add a conditional where option to match
     * @param propertie - Entity propertie
     * @param conditional - Value or operator
     * @param value - Value case operator included
     * @returns {this} - `this`
     */
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

    /**
     * Add a exists conditional option to match
     * @param exists - A entity target or where query handler
     * @param conditional - Where query case another table entity included
     * @returns {this} - `this`
     */
    public whereExists<Source extends Target | WhereQueryHandler<T>>(
        exists: Source,
        conditional: typeof exists extends Target
            ? WhereQueryHandler<Source>
            : never
    ): this {
        this.currentAnd.whereExists(exists, conditional)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add a and where conditional option
     */
    public and = this.where

    // ------------------------------------------------------------------------

    /**
     * Add a and exists contional option
     */
    public andExists = this.whereExists

    // ------------------------------------------------------------------------

    /**
     * Initialize a new OR where condtional options
     * @returns 
     */
    public or(): this {
        this.verifyCurrentAnd()
        this.orOptions.push(this.currentAnd)
        this.orOptions.push(this.addAndClause())

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * * Initialize and define a new OR where condtional options
     * @param propertie - Entity propertie
     * @param conditional - Value or operator
     * @param value - Value case operator included
     * @returns {this} - `this`
     */
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
        this.or()
        this.currentAnd.where(propertie, conditional, value)

        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `ConditionalQueryOptions` object
    * @returns - A object with conditional options
    */
    public toQueryOptions(): (
        AndQueryOptions<InstanceType<T>> |
        OrQueryOptions<InstanceType<T>>
    ) {
        if (this._orOptions) return this._orOptions.map(opt => opt.toQueryOptions())
        return this.currentAnd.toQueryOptions()
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private addAndClause(): AndQueryBuilder<T> {
        this.currentAnd = new AndQueryBuilder(
            this.target,
            this.alias
        )

        return this.currentAnd
    }

    // ------------------------------------------------------------------------

    private verifyCurrentAnd(): void {
        if (Object.keys(this.currentAnd._options).length === 0) throw new Error
    }
}