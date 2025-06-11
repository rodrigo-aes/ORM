import { EntityMetadata, RelationMetadata } from "../../Metadata"

import BaseEntity, { ColumnsSnapshots } from "../../BaseEntity"

// SQL Builders
import JoinSQLBuilder from "../JoinSQLBuilder"
import ConditionalSQLBuilder from "../ConditionalQueryBuilder"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "../ConditionalQueryBuilder"
import type { UpdateAttributes } from "./types"

export default class UpdateSQLBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias: string

    constructor(
        public target: T,
        public attributes: UpdateAttributes<InstanceType<T>>,
        public conditional?: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.metadata.tableName} ${this.alias}
            ${this.joinsSQL()}
            ${this.setSQL()}
            ${this.whereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return this.buildJoins().map(join => join.SQL()).join(' ')
    }

    // ------------------------------------------------------------------------

    public setSQL(): string {
        return `SET ${this.setValuesSQL()}`
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return this.conditional
            ? ConditionalSQLBuilder.where(
                this.target,
                this.conditional,
                this.alias
            )
                .SQL()
            : ''
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private setValuesSQL(): string {
        return Object.entries(this.onlyChangedAttributes()).map(
            ([column, value]) => `
                ${this.alias}.${column} = ${PropertySQLHelper.valueSQL(value)}
            `
        )
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private onlyChangedAttributes(): any {
        return this.attributes instanceof BaseEntity
            ? ColumnsSnapshots.changed(this.attributes)
            : this.attributes
    }

    // ------------------------------------------------------------------------

    private buildJoins(): JoinSQLBuilder<any>[] {
        return Object.entries(this.extractConditionalRelations()).flatMap(
            ([key]) => this.handleJoin(key)
        )
    }

    // ------------------------------------------------------------------------

    private handleJoin(
        key: string,
        metadata: EntityMetadata = this.metadata,
        parentAlias: string = this.alias
    ): JoinSQLBuilder<any> | JoinSQLBuilder<any>[] {
        const [first, second, ...rest] = key.split('.')
        const relation = metadata.relations!.find(
            ({ name }) => name === first
        )!

        const join = new JoinSQLBuilder(
            relation,
            parentAlias,
            {}
        )

        if (rest.length === 0) return join

        metadata = EntityMetadata.findOrBuild(
            RelationMetadata.extractEntityTarget(
                relation,
                this.attributes instanceof BaseEntity
                    ? this.attributes
                    : undefined
            )
        )

        const next = this.handleJoin(
            `${second}.${rest.join('.')}`,
            metadata,
            join.alias
        )

        return [
            join,
            ...Array.isArray(next)
                ? next
                : [next]
        ]
    }

    // ------------------------------------------------------------------------

    private extractConditionalRelations(): (
        ConditionalQueryOptions<InstanceType<T>>
    ) {
        return this.conditional
            ? Object.fromEntries(Object.entries(this.conditional).flatMap(
                ([key, value]) => key.includes('.')
                    ? [[key, value]]
                    : []
            )) as (
                ConditionalQueryOptions<InstanceType<T>>
            )

            : {}
    }
}