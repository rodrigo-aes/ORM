import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"

import BaseEntity from "../../../BaseEntity"

// Procedures
import { SyncManyToMany } from "../../Procedures"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type {
    BelongsToManyMetadata,
} from "../../../Metadata"

import type {
    EntityTarget
} from "../../../../types/General"

export default class BelongsToManyHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelationHandlerSQLBuilder<
    BelongsToManyMetadata,
    Target,
    Related
> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {}
    }

    // Privates ---------------------------------------------------------------
    private get joinTable(): string {
        return this.metadata.joinTable.tableName
    }

    // ------------------------------------------------------------------------

    private get joinTableAlias(): string {
        return `${this.joinTable}_jt`
    }

    // ------------------------------------------------------------------------

    private get targetForeignKey(): string {
        return this.metadata.targetForeignKey.name
    }

    // ------------------------------------------------------------------------

    private get relatedForeignKey(): string {
        return this.metadata.entityForeignKey.name
    }

    // ------------------------------------------------------------------------

    private get joinColumns(): string {
        return `${this.targetForeignKey}, ${this.relatedForeignKey}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createForeingKeysSQL(
        relateds: InstanceType<Related> | InstanceType<Related>[]
    ): [string, any[]] {
        return Array.isArray(relateds)
            ? this.bulkCreateForeignKeySQL(relateds)
            : this.createForeignKeySQL(relateds)
    }

    // ------------------------------------------------------------------------

    public attachSQL(...relateds: (InstanceType<Related> | any)[]) {
        const primaryKeys: any[] = this.extractSyncPrimaryKeys(relateds)
        return this.syncInsertSQL(primaryKeys)
    }

    // ------------------------------------------------------------------------

    public detachSQL(...relateds: (InstanceType<Related> | any)[]) {
        const primaryKeys: any[] = this.extractSyncPrimaryKeys(relateds)
        return this.syncDeleteSQL(primaryKeys)
    }

    // ------------------------------------------------------------------------

    public syncSQL(...relateds: (InstanceType<Related> | any)[]) {
        const primaryKeys: any[] = this.extractSyncPrimaryKeys(relateds)
        if (!this.targetMetadata.connection) throw new Error

        return SyncManyToMany.SQL(
            this.syncInsertSQL(primaryKeys),
            this.syncDeleteSQL(primaryKeys)
        )
    }

    // ------------------------------------------------------------------------

    public syncWithoutDeleteSQL(...relateds: (InstanceType<Related> | any)[]) {
        const primaryKeys: any[] = this.extractSyncPrimaryKeys(relateds)
        if (!this.targetMetadata.connection) throw new Error

        return SyncManyToMany.SQL(this.syncInsertSQL(primaryKeys))
    }

    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `EXISTS (
            SELECT 1 FROM ${this.relatedTable} ${this.relatedAlias}
                WHERE EXISTS (
                    SELECT 1 FROM ${this.joinTable} ${this.joinTableAlias}
                        WHERE ${this.joinTableAlias}.${this.relatedForeignKey} 
                        = ${this.relatedAlias}.${this.relatedPrimary as string}
                        AND ${this.joinTableAlias}.${this.targetForeignKey} = 
                        ${this.targetAlias}.${this.targetPrimary as string}
                )
        )`
    }

    // Privates ---------------------------------------------------------------
    private createForeignKeySQL(related: InstanceType<Related>): (
        [string, any[]]
    ) {
        const sql = SQLStringHelper.normalizeSQL(`
            INSERT INTO ${this.joinTable} 
            (${this.joinColumns})
            VALUES (?, ?)
        `)

        const values = this.foreignKeysValues(related)

        return [sql, values]
    }

    // ------------------------------------------------------------------------

    private bulkCreateForeignKeySQL(relateds: InstanceType<Related>[]): (
        [string, any[][]]
    ) {
        const sql = SQLStringHelper.normalizeSQL(`
            INSERT INTO ${this.joinTable}
            (${this.joinColumns})
            VALUES ${'(?, ?), '.repeat(relateds.length)}
        `)

        const values = relateds.map(
            related => this.foreignKeysValues(related)
        )

        return [sql, values]
    }

    // ------------------------------------------------------------------------

    private syncInsertSQL(primaryKeys: any[]): string {
        return `
            INSERT IGNORE INTO ${this.joinTable} (${this.joinColumns})
            VALUES (${this.syncInsertValuesSQL(primaryKeys)})
        `
    }

    // ------------------------------------------------------------------------

    private syncDeleteSQL(primaryKeys: any[]): string {
        return `
            DELETE FROM ${this.joinTable}
            WHERE ${this.targetForeignKey} = ${this.targetPrimaryValue}
            AND ${this.relatedForeignKey} NOT IN (
                ${this.primaryKeysInSQL(primaryKeys)}
            )
        `
    }

    // ------------------------------------------------------------------------

    private foreignKeysValues(related: InstanceType<Related>): any[] {
        return [
            this.targetPrimaryValue,
            related[this.relatedPrimary]
        ]
    }

    // ------------------------------------------------------------------------

    private extractSyncPrimaryKeys(
        relateds: (InstanceType<Related> | any)[]
    ): any[] {
        return relateds.map(
            related => related instanceof BaseEntity
                ? this.extractRelatedPrimaryKey(related as (
                    InstanceType<Related>
                ))
                : related
        )
    }

    // ------------------------------------------------------------------------

    private extractRelatedPrimaryKey(related: InstanceType<Related>): any {
        return related[this.relatedPrimary]
    }

    // ------------------------------------------------------------------------

    private syncInsertValuesSQL(primaryKeys: any[]): string {
        return primaryKeys.map(
            key => `(
                ${this.targetPrimaryValue},
                ${PropertySQLHelper.valueSQL(key)}
            )`
        )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private primaryKeysInSQL(primaryKeys: any[]): string {
        return primaryKeys.map(key => PropertySQLHelper.valueSQL(key))
            .join(', ')
    }
}