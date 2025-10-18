// SQL Builders
import ConditionalSQLBuilder, { ConditionalQueryOptions } from ".."
import UnionSQLBuilder from "../../UnionSQLBuilder"

// Symbols
import { Exists, Cross } from "./Symbol"

// Handlers
import { MetadataHandler, type RelationMetadataType } from "../../../Metadata"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type { Target, TargetMetadata } from "../../../types"
import type {
    ExistsQueryOptions,
    EntityExistsQueryOptions,
    EntityExistsQueryOption
} from "./types"

export default class ExistsSQLBuilder<T extends Target> {
    protected metadata: TargetMetadata<T>
    public unions: UnionSQLBuilder[] = []

    constructor(
        public target: T,
        public options: string | ExistsQueryOptions<InstanceType<T>>[
            typeof Exists
        ],
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(this.handleSQL())
    }

    // Privates ---------------------------------------------------------------
    private handleSQL(
        metadata: TargetMetadata<any> = this.metadata,
        options: string | EntityExistsQueryOptions<any> = this.options,
        parentAlias: string = this.alias,
        alias?: string
    ): string {
        return typeof options === 'object'
            ? Object
                .entries(options)
                .map(([relation, options]) => this.existsSQL(
                    metadata,
                    metadata.relations.findOrThrow(relation),
                    typeof options === 'object' ? options : undefined,
                    parentAlias,
                    alias
                ))
                .join(' AND ')

            : options

    }

    // ------------------------------------------------------------------------

    private existsSQL(
        parentMeta: TargetMetadata<any>,
        relation: RelationMetadataType,
        options?: EntityExistsQueryOption<any>,
        parentAlias: string = parentMeta.name,
        alias: string = `${parentAlias}_${relation.name}Ex`
    ): string {
        const metadata = MetadataHandler.targetMetadata(relation.relatedTarget)

        return `EXISTS (SELECT 1 FROM ${metadata.tableName} ${alias} ${(
            this.whereSQL(
                parentMeta, metadata, relation, options, parentAlias, alias
            )
        )})`
    }

    // ------------------------------------------------------------------------

    private whereSQL(
        parentMeta: TargetMetadata<any>,
        metadata: TargetMetadata<any>,
        relation: RelationMetadataType,
        options?: EntityExistsQueryOption<any>,
        parentAlias?: string,
        alias?: string
    ): string {
        const on = ConditionalSQLBuilder.on(
            parentMeta.target,
            metadata.target,
            relation,
            options?.where as ConditionalQueryOptions<any> | undefined,
            parentAlias,
            alias
        )

        this.unions.push(...on.unions)

        return `WHERE ${on.fixedConditionalSQL()}${on.conditionalSQL(true)}${(
            options?.relations
                ? ` AND ${(this.handleSQL(
                    metadata, options.relations, on.alias
                ))}`
                : ''
        )}`
    }
}

export {
    Exists,
    Cross,

    type ExistsQueryOptions,
    type EntityExistsQueryOption
}