import { MetadataHandler } from "../../Metadata"

// SQL Builders
import {
    Exists,

    type ExistsQueryOptions as SQLBuilderQueryOptions,
    type EntityExistsQueryOption as SQLBuilderEntityExistsQueryOption,
    type ConditionalQueryOptions
} from "../../SQLBuilders"

// Query Builders
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Handlers
import QueryBuilderHandler from "../QueryBuilderHandler"

// Types
import type { Target, TargetMetadata, EntityRelationsKeys } from "../../types"
import type { ConditionalQueryHandler } from "../types"
import type {
    ExistsQueryOptions,
    EntityExistsQueryOptions,
    EntityExistsQueryOption
} from "./types"

/** @internal */
export default class ExistsQueryBuilder<T extends Target> {
    protected metadata: TargetMetadata<T>
    private options!: (
        string |
        SQLBuilderQueryOptions<InstanceType<T>>[typeof Exists]
    )

    constructor(
        public target: T,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public add(options: ExistsQueryOptions<T>): this {
        switch (typeof options) {
            case "string": this.options = options
                break

            // ----------------------------------------------------------------

            case "object": this.handleEntityExistsOptions(options)
                break
        }

        return this
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): SQLBuilderQueryOptions<InstanceType<T>> {
        return { [Exists]: this.options }
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public toNestedOptions(): Exclude<
        SQLBuilderQueryOptions<InstanceType<T>>[typeof Exists], string
    > {
        return this.options as any
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private handleEntityExistsOptions(options: EntityExistsQueryOptions<T>) {
        this.options = typeof this.options === 'object'
            ? this.options
            : {}

        for (const [relation, { relations, where }] of
            Object.entries(options) as [
                EntityRelationsKeys<InstanceType<T>>,
                EntityExistsQueryOption<any>
            ][]
        ) {
            const rel = this.metadata.relations.findOrThrow(relation);

            (this.options[relation] as (
                SQLBuilderEntityExistsQueryOption<any>
            )) = {
                where: where
                    ? this.handleConditional(rel.relatedTarget, where)
                    : undefined,

                relations: relations
                    ? this.handleExists(rel.relatedTarget, relations)
                    : undefined
            }
        }
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private handleConditional<T extends Target>(
        target: T,
        handler: ConditionalQueryHandler<T>
    ): ConditionalQueryOptions<InstanceType<T>> {
        return QueryBuilderHandler
            .handle(new ConditionalQueryBuilder(target, this.alias), handler)
            .toQueryOptions()
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private handleExists<T extends Target>(
        target: T,
        options: EntityExistsQueryOptions<T>
    ): Exclude<
        SQLBuilderQueryOptions<InstanceType<T>>[typeof Exists],
        string
    > {
        return new ExistsQueryBuilder(target, this.alias)
            .add(options)
            .toNestedOptions()
    }
}

export {
    type ExistsQueryOptions
}