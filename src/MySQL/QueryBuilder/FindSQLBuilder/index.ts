import { EntityMetadata } from "../../Metadata"

// Metadata 
import { PolymorphicBelongsToMetadata } from "../../Metadata"

// Query Builders
import TableUnionSQLBuilder from "../TableUnionSQLBuilder"
import SelectSQLBuilder from "../SelectSQLBuilder"
import JoinSQLBuilder from "../JoinSQLBuilder"

import ConditionalSQLBuilder, {
    WhereSQLBuilder
} from "../ConditionalQueryBuilder"

import OrderSQLBuilder from "../OrderSQLBuilder"
import GroupSQLBuilder from "../GroupSQLBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { FindQueryOptions, IncludedQueryEntities } from "./types"
import type { EntityRelationsKeys } from "../types"
import type { RelationOptions, RelationsOptions } from "../JoinSQLBuilder/types"

export default class FindSQLBuilder<T extends EntityTarget> {
    private metadata: EntityMetadata

    public alias: string
    public entities: IncludedQueryEntities = []

    public unions: TableUnionSQLBuilder[] = []
    public select: SelectSQLBuilder<T>
    public joins: JoinSQLBuilder<any>[] = []
    public where?: WhereSQLBuilder<T>
    public group?: GroupSQLBuilder<T>
    public order?: OrderSQLBuilder<T>
    public limit?: number
    public offset?: number

    constructor(
        public target: T,
        public options: FindQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.entities.push([this.alias, undefined, this.target])
        this.metadata = this.loadMetadata()
        this.select = this.buildSelect()

        this.group = this.buildGroup()

        if (this.options.relations) this.buildJoins(
            this.options.relations
        )

        this.where = this.buildWhere()
        this.order = this.buildOrder()

        this.assingRestQueryOptions()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return [
            this.unionsSQL(),
            this.selectSQL(),
            this.joinsSQL(),
            this.whereSQL(),
            this.groupSQL(),
            this.orderSQL(),
            this.limitSQL(),
            this.offsetSQL(),
        ]
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public unionsSQL(): string {
        return this.unions.map(union => union.SQL())
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public selectSQL(): string {
        return this.select.SQL()
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return this.joins.map(join => join.SQL())
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return this.where?.SQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public groupSQL(): string {
        return this.group?.SQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public orderSQL(): string {
        return this.order?.SQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public limitSQL(): string {
        return this.limit
            ? `LIMIT ${this.limit}`
            : ''
    }

    // ------------------------------------------------------------------------

    public offsetSQL(): string {
        return this.offset
            ? `OFFSET ${this.offset}`
            : ''
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private buildSelect(): SelectSQLBuilder<T> {
        return new SelectSQLBuilder(
            this.target,
            this.options.select
        )
    }

    // ------------------------------------------------------------------------

    private buildJoins(
        relations: RelationOptions<any>,
        alias: string = this.alias
    ): void {
        const entries = Object.entries(relations) as [
            EntityRelationsKeys<any>,
            RelationOptions<any>
        ][]

        for (const [name, options] of entries) {
            const relation = this.metadata.relations?.find(
                (rel) => rel.name === name
            )

            if (!relation) throw new Error

            const join = new JoinSQLBuilder(
                relation,
                alias,
                options
            )

            this.entities.push([
                join.alias,
                relation.name,
                relation instanceof PolymorphicBelongsToMetadata
                    ? relation.related()
                    : relation.relatedTarget,
            ])

            const selectBuilder = join.selectQueryBuilder()
            this.select.merge(selectBuilder)
            this.joins.push(join)

            if (this.group) if (
                Object.keys(this.options.group ?? {}).length === 0
            ) this.group.merge(
                selectBuilder.groupQueryBuilder()
            )

            if (join.hasTableUnion()) this.unions.push(
                join.tableUnionQueryBuilder()!
            )

            if (relations.relations) this.buildJoins(
                relations.relations,
                join.alias
            )
        }
    }

    // ------------------------------------------------------------------------

    private buildWhere(): WhereSQLBuilder<T> | undefined {
        if (this.options.where) return ConditionalSQLBuilder.where(
            this.target,
            this.options.where,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private buildGroup(): GroupSQLBuilder<T> | undefined {
        const shouldBuild = (
            this.options.group ||
            this.options.select?.count ||
            this.hasRelationCount()
        )

        const options = shouldBuild
            ? this.options.group ?? [...this.metadata.columns].map(
                ({ name }) => name
            )
            : undefined

        if (shouldBuild) return new GroupSQLBuilder(
            this.target,
            options!,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private buildOrder(): OrderSQLBuilder<T> | undefined {
        if (this.options.order) return new OrderSQLBuilder(
            this.target,
            this.options.order,
            this.alias
        )

    }

    // ------------------------------------------------------------------------

    private assingRestQueryOptions(): void {
        const { limit, offset } = this.options

        Object.assign(this, {
            limit,
            offset
        })
    }

    // ------------------------------------------------------------------------

    public hasRelationCount(options?: RelationsOptions<any>): boolean {
        options = options ?? this.options.relations

        for (const value of Object.values(options ?? {})) {
            if (typeof value === 'boolean') return false
            if (Object.values(value.select?.count ?? {}).length > 0) return (
                true
            )

            if (value.relations) if (
                this.hasRelationCount(value.relations)
            ) return true
        }

        return false
    }
}

export {
    type FindQueryOptions
}