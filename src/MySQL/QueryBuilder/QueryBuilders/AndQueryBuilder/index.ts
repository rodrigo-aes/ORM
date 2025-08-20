import { EntityMetadata } from "../../../Metadata"

// SQL Builders
import { Op } from "../../ConditionalSQLBuilder/Operator"

// Query Builders
import OperatorQueryBuilder from "../OperatorQueryBuilder"
import ExistsQueryBuilder from "../ExistsQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { AndQueryOptions } from "../../ConditionalSQLBuilder"
import type {
    EntityProperties,
    EntityPropertiesKeys,
} from "../../types"
import type { CompatibleOperators, OperatorType } from "../OperatorQueryBuilder"
import type { WhereQueryFunction } from "../FindOneQueryBuilder/types"

export default class AndQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata
    public _options: AndQueryOptions<InstanceType<T>> = {}
    private exists?: ExistsQueryBuilder<T>

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = this.loadMetadata()
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
                            conditional as (
                                CompatibleOperators<
                                    // EntityProperties<InstanceType<T>>[K]
                                    any
                                >
                            )
                        )]
                    ]: value
                }
                : conditional as any
        )

        return this
    }

    // ------------------------------------------------------------------------

    public whereExists<Source extends EntityTarget | WhereQueryFunction<T>>(
        exists: Source,
        conditional: typeof exists extends EntityTarget
            ? WhereQueryFunction<Source>
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
        const orValue = conditional.map(
            cond => {
                if (Array.isArray(cond)) {
                    const [operator, value] = cond

                    return {
                        [OperatorQueryBuilder[operator]]: value
                    }
                }

                return cond
            }
        )

        this._options[propertie] = {
            [Op.Or]: orValue
        } as any

        return this
    }

    // ------------------------------------------------------------------------

    public and = this.where

    // ------------------------------------------------------------------------

    public toQueryOptions(): AndQueryOptions<InstanceType<T>> {
        return this._options
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}