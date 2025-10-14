import RelationHandlerSQLBuilder from "../RelationHandlerSQLBuilder"

// SQL Builders
import { WhereSQLBuilder } from "../../ConditionalSQLBuilder"
import UpdateOrCreateSQLBuilder, {
    type UpdateOrCreateAttibutes
} from "../../UpdateOrCreateSQLBuilder"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { ManyRelationMetadatatype } from "../../../Metadata"

import type {
    Target as TargetType,
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types"

import type { ConditionalQueryOptions } from "../../ConditionalSQLBuilder"
import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export default abstract class ManyRelationHandlerSQLBuilder<
    RelationMetadata extends ManyRelationMetadatatype,
    Target extends object,
    Related extends TargetType
> extends RelationHandlerSQLBuilder<
    RelationMetadata,
    Target,
    Related
> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public loadSQL(where?: ConditionalQueryOptions<InstanceType<Related>>): (
        string
    ) {
        return SQLStringHelper.normalizeSQL(
            `${this.selectSQL()} ${this.whereSQL(where)}`
        )
    }

    // ------------------------------------------------------------------------

    public loadOneSQL(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): string {
        return `${this.loadSQL(where)} LIMIT 1`
    }

    // ------------------------------------------------------------------------

    public createSQL(attributes: CreationAttributes<InstanceType<Related>>): (
        [string, any[]]
    ) {
        return [
            SQLStringHelper.normalizeSQL(`
                INSERT INTO ${this.relatedTable}
                (${this.insertColumnsSQL(attributes)})
                VALUES (${this.placeholderSetSQL(attributes)})   
            `),
            this.createValues(attributes)
        ]
    }

    // ------------------------------------------------------------------------

    public createManySQL(
        attributes: CreationAttributes<InstanceType<Related>>[]
    ): [string, any[][]] {
        return [
            SQLStringHelper.normalizeSQL(`
                INSERT INTO ${this.relatedTable}
                (${this.bulkCreateColumns(attributes).join(', ')})
                VALUES (${this.bulkPlaceholderSQL(attributes)})   
            `),
            this.createValues(attributes)
        ]
    }

    // ------------------------------------------------------------------------

    public updateOrCreateSQL(
        attributes: UpdateOrCreateAttibutes<InstanceType<Related>>
    ) {
        return new UpdateOrCreateSQLBuilder(
            this.related as EntityTarget,
            this.mergeAttributes(attributes)
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    public updateSQL(
        attributes: UpdateAttributes<InstanceType<Related>>,
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): string {
        return SQLStringHelper.normalizeSQL(
            `UPDATE ${this.relatedTable}
            ${this.setSQL(attributes)}
            ${this.whereSQL(where)}
        `)
    }

    // ------------------------------------------------------------------------

    public deleteSQL(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): string {
        return `DELETE FROM ${this.relatedTable} ${this.whereSQL(where)}`
    }

    // Protecteds -------------------------------------------------------------
    protected whereSQL(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): string {
        return this.fixedWhereSQL() + this.andSQL(where)
    }

    // ------------------------------------------------------------------------

    protected andSQL(where?: ConditionalQueryOptions<InstanceType<Related>>): (
        string
    ) {
        return where
            ? ` AND ${(
                new WhereSQLBuilder(
                    this.related,
                    where
                )
                    .conditionalSQL()
            )}`
            : ''
    }

    // ------------------------------------------------------------------------

    protected insertColumnsSQL(
        attributes: CreationAttributes<InstanceType<Related>>
    ): string {
        return this.attributesKeys(attributes).join(', ')
    }

    // ------------------------------------------------------------------------

    protected insertValuesSQL(
        attributes: CreationAttributes<InstanceType<Related>>
    ): string {
        return this.attributesValues(attributes)
            .map(value => PropertySQLHelper.valueSQL(value))
            .join(', ')
    }
}