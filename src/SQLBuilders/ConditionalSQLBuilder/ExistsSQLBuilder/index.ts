// SQL Builders
import ConditionalSQLBuilder from ".."
import UnionSQLBuilder from "../../UnionSQLBuilder"

// Symbols
import { Exists, Cross } from "./Symbol"

// Handlers
import {
    MetadataHandler,
    PolymorphicEntityMetadata,

    type EntityMetadata,
    type RelationMetadataType
} from "../../../Metadata"

import { InternalPolymorphicEntities } from "../../../BasePolymorphicEntity"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"
import type { ConditionalQueryOptions } from "../types"
import type {
    ExistsQueryOptions,
    CrossExistsQueryOptions,
    CrossExistsOption
} from "./types"

export default class ExistsSQLBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata
    public alias: string

    private unions: string[] = []
    private joins: string[] = []
    private wheres: string[] = []
    private onWheres: string[] = []

    constructor(
        public target: T,
        public options: (
            string |
            ConditionalQueryOptions<InstanceType<T>> & CrossExistsQueryOptions
        ),
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target!)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            EXISTS (${this.handleExistQuery()})
        `)
    }

    // Privates ---------------------------------------------------------------
    private handleExistQuery(): string {
        switch (typeof this.options) {
            case "string": return this.options
            case "object":
                this.handleRelationsOptions()
                this.handleCrossOptions()

                return this.selectSQL()

            default: throw new Error()
        }
    }

    // ------------------------------------------------------------------------

    private selectSQL(): string {
        return `
            ${this.unions.join(' ')}
            SELECT 1 FROM ${this.metadata.tableName}
            ${this.joins.join(' ')}
            WHERE ${this.wheres.join(' AND ')} AND
            ${this.onWheres.join(' AND ')}
        `
    }

    // ------------------------------------------------------------------------

    private handleRelationsOptions(
        metadata: EntityMetadata | PolymorphicEntityMetadata = this.metadata,
        options: any = this.options
    ) {
        const included = new Set<string>()

        for (const key of Object.keys(options)) {
            if (!key.includes('.')) throw new Error

            const relName = key.split('.').shift()!
            if (included.has(relName)) continue

            const options = {
                [relName]: this.formatRelationsOptions(relName)
            }

            this.handleQueryParts(options, metadata)

            included.add(relName)
        }
    }

    // ------------------------------------------------------------------------

    private handleCrossOptions() {
        if (!Object.getOwnPropertySymbols(this.options).includes(Cross)) return

        for (const { target, where } of (
            (this.options as CrossExistsQueryOptions)[Cross] as (
                CrossExistsOption[]
            ))
        ) {
            const meta = MetadataHandler.loadMetadata(target)
            if (meta instanceof PolymorphicEntityMetadata) this.addUnion(meta)

            if (where) {
                const whereOptions = Object.fromEntries(
                    Object.entries(where).filter(([key]) => !key.includes('.'))
                )
                const relationsOptions = Object.fromEntries(
                    Object.entries(where).filter(([key]) => key.includes('.'))
                )

                if (meta instanceof PolymorphicEntityMetadata) this.addUnion(meta)
                this.addJoin(meta)
                this.handleRelationsOptions(meta, relationsOptions)
                this.addWhere(
                    target,
                    whereOptions,
                    meta.tableName
                )
            }
        }
    }

    // ------------------------------------------------------------------------

    private handleQueryParts(
        options: any,
        metadata: EntityMetadata | PolymorphicEntityMetadata = this.metadata
    ) {
        for (const [name, opts] of Object.entries(options)) {
            const relation = metadata.relations.findOrThrow(name)

            const meta = MetadataHandler.loadMetadata(relation.relatedTarget)
            if (meta instanceof PolymorphicEntityMetadata) this.addUnion(meta)

            const whereOptions = this.extractWhereOptions(opts)
            const nested = this.extractNestedRelationOptions(opts)

            this.addJoin(meta)
            this.addWhere(
                relation.relatedTarget,
                whereOptions,
                meta.tableName
            )
            this.addOnWhere(
                relation,
                metadata.tableName,
                meta.tableName,
                metadata.target!
            )

            if (Object.keys(nested).length > 0) this.handleQueryParts(
                nested,
                meta,
            )
        }
    }

    // ------------------------------------------------------------------------

    private addUnion(metadata: PolymorphicEntityMetadata): void {
        this.unions.push(
            new UnionSQLBuilder(
                metadata.tableName,
                metadata.target ?? InternalPolymorphicEntities.get(
                    metadata.targetName
                )!
            )
                .SQL()
        )
    }

    // ------------------------------------------------------------------------

    private addJoin(
        metadata: EntityMetadata | PolymorphicEntityMetadata
    ): void {
        this.joins.push(`CROSS JOIN ${metadata.tableName}`)

    }

    // ------------------------------------------------------------------------

    private addWhere(
        target: EntityTarget | PolymorphicEntityTarget,
        options: ConditionalQueryOptions<any>,
        alias: string
    ): void {
        this.wheres.push(
            ConditionalSQLBuilder.where(
                target,
                options,
                alias
            )
                .conditionalSQL()
        )
    }

    // ------------------------------------------------------------------------

    private addOnWhere(
        relation: RelationMetadataType,
        parentAlias: string,
        alias: string,
        target: EntityTarget | PolymorphicEntityTarget
    ): void {
        this.onWheres.push(
            ConditionalSQLBuilder.on(
                relation,
                parentAlias,
                alias,
                target
            )
                .fixedSQL()
        )
    }

    // ------------------------------------------------------------------------

    private extractWhereOptions(options: any): any {
        return Object.fromEntries(Object.entries(options).filter(
            ([_, value]) => typeof value !== 'object'
        ))
    }

    // ------------------------------------------------------------------------

    private extractNestedRelationOptions(options: any): any {
        return Object.fromEntries(Object.entries(options).filter(
            ([_, value]) => typeof value === 'object'
        ))
    }

    // ------------------------------------------------------------------------

    private formatRelationsOptions(
        key: string,
        options: ConditionalQueryOptions<any> = this.options as (
            ConditionalQueryOptions<InstanceType<T>>
        )
    ): any {
        return Object.fromEntries(
            Object.entries(options).flatMap(
                ([k, v]) => {
                    if (k.startsWith(key)) {
                        const [_, ...rest] = k.split('.')
                        const column = rest.pop()

                        if (rest.length === 0) return [[column, v]]

                        const relName = rest.shift()!
                        return [[
                            relName,
                            this.formatRelationsOptions(
                                relName,
                                this.removeKeyPrefix(key, options)
                            )
                        ]]
                    }

                    return []
                }
            )
        )
    }

    // ------------------------------------------------------------------------

    private removeKeyPrefix(
        key: string,
        options: ConditionalQueryOptions<any>
    ): ConditionalQueryOptions<any> {
        return Object.fromEntries(
            Object.entries(options).flatMap(
                ([k, v]) => k.startsWith(key)
                    ? [[k.replace(`${key}.`, ''), v]]
                    : []
            )
        )
    }
}

export {
    Exists,
    Cross,

    type ExistsQueryOptions,
    type CrossExistsQueryOptions
}