import { EntityMetadata } from "../../../Metadata"

// Query Builders
import { Op } from "../../ConditionalQueryBuilder/Operator"

// Query Handlers
import OperatorQueryHandler from "../OperatorQueryHandler"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { AndQueryOptions } from "../../ConditionalQueryBuilder"
import type {
    EntityProperties,
    EntityPropertiesKeys,
} from "../../types"
import type { CompatibleOperators, OperatorType } from "../OperatorQueryHandler"

export default class AndQueryHandler<T extends EntityTarget> {
    protected metadata: EntityMetadata
    public options: AndQueryOptions<InstanceType<T>> = {}

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = this.loadMetadata()
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
        this.options[propertie] = (
            OperatorQueryHandler.isOperator(
                conditional as string
            )
                ? {
                    [
                        OperatorQueryHandler[(
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
                        [OperatorQueryHandler[operator]]: value
                    }
                }

                return cond
            }
        )

        this.options[propertie] = {
            [Op.Or]: orValue
        } as any

        return this
    }

    // ------------------------------------------------------------------------

    public and = this.where

    // ------------------------------------------------------------------------

    public toQueryOptions(): AndQueryOptions<InstanceType<T>> {
        return this.options
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}