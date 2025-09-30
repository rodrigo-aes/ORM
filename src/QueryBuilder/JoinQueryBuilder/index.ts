import { MetadataHandler, RelationMetadata } from "../../Metadata"

// Query Handlers
import SelectQueryBuilder from "../SelectQueryBuilder"
import ConditionalQueryHandler from "../ConditionalQueryBuilder"

// Types
import type {
    Target,
    TargetMetadata,
    EntityTarget,
} from "../../types"

import type {
    RelationOptions,
    RelationsOptions
} from "../../SQLBuilders"

import type {
    JoinQueryOptions,
    JoinQueryClause,
} from "./types"

import type {
    SelectQueryHandler,
    OnQueryHandler,
    JoinQueryHandler
} from "../types"

// Exceptions
import PolyORMException from "../../Errors"

/**
 * Build `JOIN` options
 */
export default class JoinQueryBuilder<T extends Target> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private _options: JoinQueryClause<T> = {
        relations: {}
    }

    /** @internal */
    constructor(
        /** @internal */
        public target: T,

        /** @internal */
        public alias?: string,

        required?: boolean
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this._options.required = required
    }

    // Instace Methods ========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Add required to current entity `INNER JOIN` to query options
     * @param relation - Related entity target
     * @param joinClause - Join query handler
     * @returns {this} - `this`
     */
    public innerJoin<T extends EntityTarget>(
        relation: T | string,
        joinClause?: JoinQueryHandler<T>
    ): this {
        JoinQueryBuilder.build(
            this.metadata,
            relation,
            this._options.relations!,
            joinClause,
            this.alias
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add optional to current entity `LEFT JOIN` to query options
     * @param relation - Related entity target
     * @param joinClause - Join query handler
     * @returns {this} - `this`
     */
    public leftJoin<T extends EntityTarget>(
        relation: T | string,
        joinClause?: JoinQueryHandler<T>
    ): this {
        JoinQueryBuilder.build(
            this.metadata,
            relation,
            this._options.relations!,
            joinClause,
            this.alias,
            false
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Handle select options to related join entity
     * @param selectClause - Select query handler
     * @returns {this} - `this`
     */
    public select(selectClause: SelectQueryHandler<T>): this {
        this._options.select = new SelectQueryBuilder(
            this.target,
            this.alias
        )

        selectClause(this._options.select)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define conditional `ON` clause to options
     * @param onClause - On query handler
     * @returns {this} - `this`
     */
    public on(onClause: OnQueryHandler<T>): this {
        this._options.on = new ConditionalQueryHandler(
            this.target,
            this.alias
        )

        onClause(this._options.on)

        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `RelationOptions` object
    * @returns - A object with relation options
    */
    public toQueryOptions(): RelationOptions<InstanceType<T>> {
        const { required, select, on } = this._options

        return {
            required,
            select: select?.toQueryOptions(),
            on: on?.toQueryOptions(),
            relations: this.relationsToOptions()
        }
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private relationsToOptions(): (
        RelationsOptions<InstanceType<T>> | undefined
    ) {
        if (!this._options.relations) return

        return Object.fromEntries(
            Object.entries(this._options.relations).map(
                ([name, value]) => [
                    name,
                    typeof value === 'boolean'
                        ? value
                        : (value as JoinQueryBuilder<any>).toQueryOptions()
                ]
            )
        ) as RelationsOptions<InstanceType<T>>
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build<
        Parent extends Target = Target,
        Related extends Target = Target
    >(
        metadata: TargetMetadata<any>,
        relation: Related | string,
        options: JoinQueryOptions<Parent>,
        joinClause?: JoinQueryHandler<Related>,
        alias?: string,
        required: boolean = true
    ) {
        if (joinClause) joinClause(this.instantiate(
            metadata,
            relation,
            options,
            alias,
            required
        ))

        else options[(typeof relation === 'string'
            ? relation
            : this.findRelation(metadata, relation).name
        ) as keyof JoinQueryOptions<Parent>] = true

    }

    // Privates ---------------------------------------------------------------
    private static instantiate<
        Parent extends Target = Target,
        Related extends Target = Target
    >(
        metadata: TargetMetadata<any>,
        relation: Related | string,
        options: JoinQueryOptions<Parent>,
        alias?: string,
        required: boolean = true
    ): JoinQueryBuilder<Related> {
        const [key, join] = JoinQueryBuilder.buildJoin<Parent, Related>(
            metadata,
            relation,
            alias,
            required
        )

        options[key] = join

        return join
    }

    // ------------------------------------------------------------------------

    private static buildJoin<
        Parent extends Target = Target,
        Related extends Target = Target
    >(
        metadata: TargetMetadata<any>,
        relation: Related | string,
        alias?: string,
        required: boolean = true
    ): [keyof JoinQueryOptions<Parent>, JoinQueryBuilder<Related>] {
        const { name, relatedTarget } = this.findRelation(metadata, relation)

        return [
            name as keyof JoinQueryOptions<Parent>,
            new JoinQueryBuilder(
                relatedTarget as Related,
                alias,
                required
            )
        ]
    }

    // ------------------------------------------------------------------------

    private static findRelation<Related extends Target>(
        metadata: TargetMetadata<any>,
        relation: Related | string
    ): RelationMetadata {
        switch (typeof relation) {
            case "string": return (
                metadata.relations.findOrThrow(relation as string)
            )

            case "function": return (
                metadata.relations?.findOrThrow(relation)
            )

            default: throw new Error('Unreacheable Exception')
        }
    }
}

export {
    type JoinQueryOptions
}