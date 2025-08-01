import RelationHandlerSQLBuilder from "../RelationHandlerSQLBuilder"
import BaseEntity, { ColumnsSnapshots } from "../../../BaseEntity"
import BaseEntityUnion from "../../../BaseEntityUnion"

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
    EntityTarget,
    UnionEntityTarget
} from "../../../../types/General"

import type { ConditionalQueryOptions } from "../../ConditionalSQLBuilder"
import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export default abstract class ManyRelationHandlerSQLBuilder<
    RelationMetadata extends ManyRelationMetadatatype,
    Target extends object,
    Related extends EntityTarget | UnionEntityTarget
> extends RelationHandlerSQLBuilder<
    RelationMetadata,
    Target,
    Related
> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public findSQL(where?: ConditionalQueryOptions<InstanceType<Related>>): (
        string
    ) {
        return SQLStringHelper.normalizeSQL(`
            ${this.selectSQL()} ${this.whereSQL(where)}
        `)
    }

    // ------------------------------------------------------------------------

    public findOneSQL(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): string {
        return SQLStringHelper.normalizeSQL(`${this.findSQL(where)} LIMIT 1`)
    }

    // ------------------------------------------------------------------------

    public createSQL(attributes: CreationAttributes<InstanceType<Related>>): (
        [string, any[]]
    ) {
        const sql = SQLStringHelper.normalizeSQL(`
            INSERT INTO ${this.relatedMetadata.tableName}
            (${this.insertColumnsSQL(attributes)})
            VALUES (${this.placeholderSetSQL(attributes)})   
        `)

        const values = this.createValues(attributes)

        return [sql, values]
    }

    // ------------------------------------------------------------------------

    public createManySQL(
        attributes: CreationAttributes<InstanceType<Related>>[]
    ): [string, any[][]] {
        const sql = SQLStringHelper.normalizeSQL(`
            INSERT INTO ${this.relatedMetadata.tableName}
            (${this.bulkCreateColumns(attributes).join(', ')})
            VALUES (${this.bulkPlaceholderSQL(attributes)})   
        `)

        const values = this.createValues(attributes)

        return [sql, values]
    }

    // ------------------------------------------------------------------------

    public updateOrCreate(
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
    ): (
            string
        ) {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.relatedTableAlias}
            ${this.setSQL(attributes)}
            ${this.whereSQL(where)}
        `)
    }

    // ------------------------------------------------------------------------

    public deleteSQL(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): string {
        return `DELETE FROM ${this.relatedAlias} ${this.whereSQL(where)}`
    }

    // Protecteds -------------------------------------------------------------
    protected whereSQL(where?: ConditionalQueryOptions<InstanceType<Related>>): (
        string
    ) {
        return `
            ${this.fixedWhereSQL()}
            ${where ? `AND ${this.andSQL(where)}` : ''}
        `
    }

    // ------------------------------------------------------------------------

    protected andSQL(where: ConditionalQueryOptions<InstanceType<Related>>): (
        string
    ) {
        return new WhereSQLBuilder(
            this.related,
            where
        )
            .conditionalSQL()
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
        return this.attributesValues(attributes).map(
            value => PropertySQLHelper.valueSQL(value)
        )
            .join(', ')
    }
}