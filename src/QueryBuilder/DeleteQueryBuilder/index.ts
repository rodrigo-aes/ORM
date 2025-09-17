// SQL Builder
import {
    DeleteSQLBuilder,

    type EntityProperties,
    type EntityPropertiesKeys
} from "../../SQLBuilders"

// Query Builders
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type DeleteResult
} from "../../Handlers"

// Types
import type { EntityTarget } from "../../types/General"
import type { WhereQueryHandler } from "../types"
import type {
    OperatorType,
    CompatibleOperators
} from "../OperatorQueryBuilder"

/**
 * Build a `DELETE` query
 */
export default class DeleteQueryBuilder<T extends EntityTarget> {
    /** @internal */
    private _sqlBuilder?: DeleteSQLBuilder<T>

    /** @internal */
    private _where?: ConditionalQueryBuilder<T>

    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get whereOptions(): ConditionalQueryBuilder<T> {
        if (!this._where) this._where = new ConditionalQueryBuilder(
            this.target,
            this.alias
        )

        return this._where
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private get sqlBuilder(): DeleteSQLBuilder<T> {
        return this._sqlBuilder ?? this.instantiateSQLBuilder()
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
        this.whereOptions.where(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------
    /**
     * Add a exists conditional option to match
     * @param exists - A entity target or where query handler
     * @param conditional - Where query case another table entity included
     * @returns {this} - `this`
     */
    public whereExists<Source extends EntityTarget | WhereQueryHandler<T>>(
        exists: Source,
        conditional: typeof exists extends EntityTarget
            ? WhereQueryHandler<Source>
            : never
    ): this {
        this.whereOptions.whereExists(
            exists as EntityTarget,
            conditional as WhereQueryHandler<EntityTarget>
        )

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
        this.whereOptions.or()
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Initialize and define a new OR where condtional options
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
        this.whereOptions.orWhere(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Delete result
    */
    public exec(): Promise<DeleteResult> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'raw'
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private instantiateSQLBuilder(): DeleteSQLBuilder<T> {
        this._sqlBuilder = new DeleteSQLBuilder(
            this.target,
            this._where?.toQueryOptions() ?? {},
            this.alias
        )

        return this._sqlBuilder
    }
}