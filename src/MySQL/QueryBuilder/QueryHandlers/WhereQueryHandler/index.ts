import { EntityMetadata } from "../../../Metadata"

// Query Handlers
import AndQueryHandler from "../AndQueryHandler"

// Types
import type { EntityTarget } from "../../../../types/General"
import type {
    AndQueryOptions,
    OrQueryOptions
} from "../../ConditionalQueryBuilder"

import type { WhereQueryFunction } from "./types"

import type { EntityProperties, EntityPropertiesKeys } from "../../types"
import type { CompatibleOperators, OperatorType } from "../OperatorQueryHandler"

export default class WhereQueryHandler<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private currentAnd!: AndQueryHandler<T>
    private orOpts?: AndQueryHandler<T>[]

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

    public or(whereClause: WhereQueryFunction<T>): this {
        if (!this.orOpts) this.orOpts = []
        this.orOpts.push(this.currentAnd)

        this.addAndClause()
        whereClause(this.currentAnd)
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
        this.currentAnd = new AndQueryHandler(
            this.target,
            this.alias
        )
    }
}

export {
    type WhereQueryFunction
}