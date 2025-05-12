// Types
import { ColumnBuilder, JoinColumnBuilder } from "../../../TableBuilder"
import type { ColumnSchemaInitMap } from "./types"
import type { AlterColumnAction } from "../types"
import type { ForeignKeyActionListener } from "../../../../Metadata"

export default class ColumnSchema {
    public tableName!: string
    public columnName!: string
    public dataType!: string
    public columnType!: string
    public length!: number | null
    public isNullable!: boolean
    public isPrimary!: boolean
    public isAutoIncrement!: boolean
    public hasDefaultValue!: boolean
    public defaultValue!: string | number | null
    public isUnsigned!: boolean
    public isUnique!: boolean
    public isForeignKey!: boolean
    public foreignTable!: string | null
    public foreignColumn!: string | null
    public foreignKeyName!: string | null
    public onDelete!: string | null
    public onUpdate!: string | null

    constructor(initMap: ColumnSchemaInitMap) {
        Object.assign(this, initMap)
    }


    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public dropSQL(): string {
        const dropColumn = `DROP COLUMN ${this.columnName}`
        const dropForeignKey = this.isForeignKey
            ? `DROP FOREIGN KEY ${this.foreignKeyName}`
            : undefined

        return `${dropForeignKey ? `${dropForeignKey}, ` : ''}${dropColumn}`
    }

    // ------------------------------------------------------------------------

    public shouldAlter(column: ColumnBuilder | JoinColumnBuilder) {
        return (
            this.shouldAlterColumn(column) ||
            this.shouldAlterForeignKey(column) ||
            this.shouldDropForeignKey(column)
        )
    }

    // ------------------------------------------------------------------------

    public shouldAlterColumn(column: ColumnBuilder | JoinColumnBuilder): (
        boolean
    ) {
        if (column instanceof ColumnBuilder) return (
            this.columnName !== column.name ||
            this.dataType !== column.dataType.type ||
            !!this.isPrimary !== !!column.primary ||
            !!this.isAutoIncrement !== !!column.autoIncrement ||
            !!this.isUnsigned !== !!column.unsigned ||
            !!this.isUnique !== !!column.unique ||
            !!this.isNullable !== !!column.nullable ||
            this.defaultValue != column.getDefaultValue()
        )

        if (column instanceof JoinColumnBuilder) return (
            this.columnName !== column.name ||
            this.dataType !== column.dataType.type ||
            !!this.isUnsigned !== !!column.unsigned
        )

        return false
    }

    // ------------------------------------------------------------------------

    public alterForeignKeyAction(column: ColumnBuilder | JoinColumnBuilder): (
        AlterColumnAction
    ) {
        if (this.shouldDropForeignKey(column)) return 'DROP'
        if (this.shouldAlterForeignKey(column)) return 'MODIFY'

        return 'NONE'
    }

    // ------------------------------------------------------------------------

    public shouldDropForeignKey(
        column: ColumnBuilder | JoinColumnBuilder
    ) {
        return this.isForeignKey && (
            !column.isForeignKey || !column.references?.constrained
        )
    }

    // ------------------------------------------------------------------------

    public shouldAlterForeignKey(
        column: ColumnBuilder | JoinColumnBuilder
    ) {
        return (
            this.foreignColumn != column.references?.column.name ||
            this.foreignTable != column.references?.entity.tableName ||

            (
                this.normalizeForeignActionListener(
                    this.onDelete as ForeignKeyActionListener
                ) !== this.normalizeForeignActionListener(
                    column.references?.onDelete
                )
            )

            ||

            (
                this.normalizeForeignActionListener(
                    this.onUpdate as ForeignKeyActionListener
                ) !== this.normalizeForeignActionListener(
                    column.references?.onUpdate
                )
            )
        )
    }

    // Privates ---------------------------------------------------------------
    private normalizeForeignActionListener(
        action: ForeignKeyActionListener | undefined
    ): ForeignKeyActionListener {
        if (!action || action === 'NO ACTION') return 'NO ACTION'
        return action
    }
}

export type {
    ColumnSchemaInitMap
}