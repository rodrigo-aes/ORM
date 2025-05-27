import { EntityMetadata, PolymorphicBelongsToMetadata } from "../../Metadata"

// Query Builders
import TableUnionQueryBuilder from "../TableUnionQueryBuilder"
import SelectQueryBuilder from "../SelectQueryBuilder"
import JoinQueryBuilder from "../JoinQueryBuilder"
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"
import OrderQueryBuilder from "../OrderQueryBuilder"
import GroupQueryBuilder from "../GroupQueryBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { FindQueryOptions } from "./types"
import type { EntityRelationsKeys } from "../types"
import type { RelationOptions } from "../JoinQueryBuilder/types"
import WhereQueryBuilder from "../ConditionalQueryBuilder/WhereQueryBuilder"

export default class FindQueryBuilder<T extends EntityTarget> {
    private metadata: EntityMetadata

    public unions: TableUnionQueryBuilder[] = []
    public select: SelectQueryBuilder<T>
    public joins: JoinQueryBuilder<any>[] = []
    public where?: WhereQueryBuilder<T>
    public group?: GroupQueryBuilder<T>
    public order?: OrderQueryBuilder<T>
    public limit?: number
    public offset?: number

    constructor(
        public target: T,
        public options: FindQueryOptions<InstanceType<T>>
    ) {
        this.metadata = this.loadMetadata()
        this.select = this.buildSelect()

        if (this.options.relations) this.buildJoins(
            this.options.relations
        )

        this.where = this.buildWhere()
        this.group = this.buildGroup()
        this.order = this.buildOrder()

        this.assingRestQueryOptions()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get alias(): string {
        return this.target.name.toLowerCase()
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
            this.orderSQL()
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

    private buildSelect(): SelectQueryBuilder<T> {
        return new SelectQueryBuilder(
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

            const join = new JoinQueryBuilder(
                relation,
                alias,
                options
            )

            this.select.merge(join.selectQueryBuilder())
            this.joins.push(join)

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

    private buildWhere(): WhereQueryBuilder<T> | undefined {
        if (this.options.where) return ConditionalQueryBuilder.where(
            this.target,
            this.options.where,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private buildGroup(): GroupQueryBuilder<T> | undefined {
        const shouldBuild = (
            this.options.group ||
            this.options.select?.count
        )

        const options = shouldBuild
            ? this.options.group ?? [this.metadata.columns.primary.name]
            : undefined

        if (shouldBuild) return new GroupQueryBuilder(
            this.target,
            options!,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private buildOrder(): OrderQueryBuilder<T> | undefined {
        if (this.options.order) return new OrderQueryBuilder(
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
}

export {
    type FindQueryOptions
}