import { EntityMetadata } from "../../Metadata"

import BaseEntity, { ColumnsSnapshots } from "../../BaseEntity"

// SQL Builders
import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Hanlders
import { ConditionalQueryJoinsHandler } from "../../Handlers"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"
import type { UpdateAttributes, UpdateAttibutesKey } from "./types"

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
        return this.conditional
            ? new ConditionalQueryJoinsHandler(
                this.target,
                this.conditional,

                this.attributes instanceof BaseEntity
                    ? this.attributes
                    : undefined,

                this.alias
            )
                .joins()
                .map(join => join.SQL())
                .join(' ')
            : ''
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
}

export {
    type UpdateAttributes,
    type UpdateAttibutesKey
}