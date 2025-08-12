import {
    EntityMetadata,
    EntityUnionMetadata,
    MetadataHandler
} from "../../Metadata"

import BaseEntity, { ColumnsSnapshots } from "../../BaseEntity"
import BaseEntityUnion from "../../BaseEntityUnion"

// SQL Builders
import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Symbols
import { Old, New } from "../../Triggers"

// Handlers
import { ConditionalQueryJoinsHandler } from "../../Handlers"
import { ScopeMetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget, EntityUnionTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"
import type { UpdateAttributes, UpdateAttibutesKey } from "./types"

export default class UpdateSQLBuilder<
    T extends EntityTarget | EntityUnionTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    public alias: string

    constructor(
        public target: T,
        public attributes: (
            UpdateAttributes<InstanceType<T>> |
            BaseEntity |
            BaseEntityUnion<any>
        ),
        public conditional?: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)

        if (this.conditional) this.conditional = (
            ScopeMetadataHandler.applyScope(
                this.target,
                'conditional',
                this.conditional
            )
        )

        if (this.attributes instanceof BaseEntityUnion) this.attributes = (
            this.attributes.toSourceEntity()
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.handleTableName()} ${this.alias}
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
    private handleTableName(): string {
        if (this.metadata instanceof EntityUnionMetadata) return (
            this.metadata.sourcesMetadata[
                (this.attributes as BaseEntity).constructor.name
            ]
                .tableName
        )

        else return this.metadata.tableName
    }

    // ------------------------------------------------------------------------

    private setValuesSQL(): string {
        return Object.entries(this.onlyChangedAttributes()).map(
            ([column, value]) => (
                typeof value === 'object' &&
                Object.getOwnPropertySymbols(value).some(
                    symbol => [Old, New].includes(symbol)
                )
            )

                ? `${this.alias}.${column} = ${(
                    value![Old as keyof typeof value]
                    ?? value![New as keyof typeof value]
                )}`
                : `${this.alias}.${column} = ${PropertySQLHelper.valueSQL(value)}`
        )
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private onlyChangedAttributes(): any {
        return (
            this.attributes instanceof BaseEntity ||
            this.attributes instanceof BaseEntityUnion
        )
            ? ColumnsSnapshots.changed(this.attributes)
            : this.attributes
    }
}

export {
    type UpdateAttributes,
    type UpdateAttibutesKey
}