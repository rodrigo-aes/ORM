import RelationHandlerSQLBuilder from "../RelationHandlerSQLBuilder"

// SQL Builders
import UpdateOrCreateSQLBuilder, {
    type UpdateOrCreateAttibutes
} from "../../UpdateOrCreateSQLBuilder"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { OneRelationMetadataType } from "../../../Metadata"

import type {
    EntityTarget,
    UnionEntityTarget
} from "../../../../types/General"

import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export default abstract class OneRelationHandlerSQLBuilder<
    RelationMetadata extends OneRelationMetadataType,
    Target extends object,
    Related extends EntityTarget | UnionEntityTarget
> extends RelationHandlerSQLBuilder<
    RelationMetadata,
    Target,
    Related
> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public loadSQL(): string {
        return SQLStringHelper.normalizeSQL(`
            ${this.selectSQL()} ${this.fixedWhereSQL()} LIMIT 1
        `)
    }

    // ------------------------------------------------------------------------

    public createSQL(attributes: CreationAttributes<InstanceType<Related>>): (
        [string, any[]]
    ) {
        const sql = SQLStringHelper.normalizeSQL(`
            INSERT INTO ${this.relatedTable}
            (${this.insertColumnsSQL(attributes)})
            VALUES (${this.placeholderSetSQL(attributes)})
        `)

        const values = this.createValues(attributes)

        return [sql, values]
    }

    // ------------------------------------------------------------------------

    public updateOrCreateSQL(
        attributes: UpdateOrCreateAttibutes<InstanceType<Related>>
    ): string {
        return new UpdateOrCreateSQLBuilder(
            this.related as EntityTarget,
            this.mergeAttributes(attributes)
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    public updateSQL(attributes: UpdateAttributes<InstanceType<Related>>): (
        string
    ) {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.relatedTableAlias}
            ${this.setSQL(attributes)}
            ${this.fixedWhereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public deleteSQL(): string {
        return `DELETE FROM ${this.relatedAlias} ${this.fixedWhereSQL()}`
    }

    // Protecteds -------------------------------------------------------------
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