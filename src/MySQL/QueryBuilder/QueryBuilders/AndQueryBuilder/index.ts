import {
    MetadataHandler,
    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../../Metadata"

// SQL Builders
import { Op } from "../../ConditionalSQLBuilder/Operator"

// Query Builders
import OperatorQueryBuilder from "../OperatorQueryBuilder"
import ExistsQueryBuilder from "../ExistsQueryBuilder"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"
import type { AndQueryOptions } from "../../ConditionalSQLBuilder"
import type {
    EntityProperties,
    EntityPropertiesKeys,
} from "../../types"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

import { WhereQueryHandler } from "../types"

export default class AndQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata
    public _options: AndQueryOptions<InstanceType<T>> = {}
    private exists?: ExistsQueryBuilder<T>

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get options(): AndQueryOptions<InstanceType<T>> {
        return {
            ...this._options,
            ...this.exists?.options
        }
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
        if (!this.exists) this.exists = new ExistsQueryBuilder(
            this.target,
            this.alias
        )

        this.exists.exists(exists, conditional)

        return this
    }

    // ------------------------------------------------------------------------

    public andOr<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            (
                EntityProperties<InstanceType<T>>[K] |
                [
                    CompatibleOperators<EntityProperties<InstanceType<T>>[K]>,
                    EntityProperties<InstanceType<T>>[K]
                ]
            )[]
        )
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

    public and = this.where

    // ------------------------------------------------------------------------

    public andExists = this.whereExists

    // ------------------------------------------------------------------------

    public toQueryOptions(): AndQueryOptions<InstanceType<T>> {
        return this._options
    }
}