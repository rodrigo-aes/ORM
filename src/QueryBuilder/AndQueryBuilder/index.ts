import { MetadataHandler } from "../../Metadata"

// SQL Builders
import { Op } from "../../SQLBuilders"

// Query Builders
import OperatorQueryBuilder from "../OperatorQueryBuilder"
import ExistsQueryBuilder from "../ExistsQueryBuilder"

// Types
import type { Target, TargetMetadata } from "../../types/General"

import type {
    AndQueryOptions,
    EntityProperties,
    EntityPropertiesKeys
} from "../../SQLBuilders"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

import { WhereQueryHandler } from "../types"

/**
 * Build a `AND` conditional options
 */
export default class AndQueryBuilder<T extends Target> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    public _options: AndQueryOptions<InstanceType<T>> = {}

    /** @internal */
    private exists?: ExistsQueryBuilder<T>

    /** @internal */
    constructor(
        /** @internal */
        public target: T,

        /** @internal */
        public alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public get options(): AndQueryOptions<InstanceType<T>> {
        return {
            ...this._options,
            ...this.exists?.options
        }
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
        this._options[propertie] = (
            OperatorQueryBuilder.isOperator(
                conditional as string
            )
                ? {
                    [
                        OperatorQueryBuilder[(
                            conditional as CompatibleOperators<(
                                EntityProperties<InstanceType<T>>[K]
                            )>
                        )]
                    ]: value
                }
                : conditional as any
        )

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
        if (!this.exists) this.exists = new ExistsQueryBuilder(
            this.target,
            this.alias
        )

        this.exists.exists(exists, conditional)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add a AND required match or options
     * @param propertie - Entity propertie
     * @param conditional - Conditinal query options array to match one or many
     * @returns {this} - `this`
     */
    public andOr<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            [
                CompatibleOperators<EntityProperties<InstanceType<T>>[K]>,
                EntityProperties<InstanceType<T>>[K]
            ]
        )[]
    >(
        propertie: K,
        conditional: Cond
    ): this {
        const orValue = conditional.map(cond => {
            if (Array.isArray(cond)) {
                const [operator, value] = cond

                return { [OperatorQueryBuilder[operator]]: value }
            }

            return cond
        })

        this._options[propertie] = { [Op.Or]: orValue } as any

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
     * Convert `this` to `AndQueryOptions` object
     * @returns - A object with and options
     */
    public toQueryOptions(): AndQueryOptions<InstanceType<T>> {
        return this.options
    }
}