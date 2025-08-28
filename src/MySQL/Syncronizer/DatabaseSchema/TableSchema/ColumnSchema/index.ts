import {
    DataType,
    EntityMetadata,
    ColumnMetadata,
    JoinColumnMetadata,

    type ForeignKeyActionListener
} from "../../../../Metadata"

// Helpers
import { SQLStringHelper } from "../../../../Helpers"

// Types
import type { EntityTarget } from "../../../../../types/General"
import type {
    ColumnSchemaInitMap,
    ColumnSchemaAction,
    ForeignKeyReferences
} from "./types"

export default class ColumnSchema {
    private static compareKeys = [
        'name',
        'dataType',
        'length',
        'nullable',
        'primary',
        'autoIncrement',
        'hasDefaultValue',
        'defaultValue',
        'unsigned',
        'unique',
        'isForeignKey',
        'references',
    ]

    public tableName!: string
    public name!: string
    public dataType!: DataType | string
    private _primary?: boolean
    private _nullable?: boolean
    private _autoIncrement?: boolean
    private _defaultValue?: string | number | null
    private _unsigned?: boolean
    private _unique?: boolean
    private _isForeignKey?: boolean
    private _references?: ForeignKeyReferences

    private _action?: ColumnSchemaAction
    private _fkAction?: ColumnSchemaAction

    constructor(initMap: ColumnSchemaInitMap) {
        Object.assign(
            this,
            Object.fromEntries(
                Object.entries(initMap).map(
                    ([key, value]) => [key.replace('_', ''), value]
                )
            )
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get foreignKeyName(): string | undefined {
        if (this._references?.constrained) return this._references.name ?? (
            `fk_${this.tableName}_${this._references.columnName}`
        )
    }

    // ------------------------------------------------------------------------

    public get dependence(): string | undefined {
        if (this._isForeignKey) return this._references!.tableName as string
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public primary(): this {
        this._primary = true
        return this
    }

    // ------------------------------------------------------------------------

    public nullable(nullable: boolean = true): this {
        this._nullable = nullable
        return this
    }

    // ------------------------------------------------------------------------

    public autoIncrement(): this {
        this._autoIncrement = true
        return this
    }

    // ------------------------------------------------------------------------

    public unsigned(): this {
        this._unsigned = true
        return this
    }

    // ------------------------------------------------------------------------

    public unique(): this {
        this._unique = true
        return this
    }

    // ------------------------------------------------------------------------

    public foreignKey(
        table: string | EntityTarget,
        column: string
    ): this {
        if (typeof table === 'object') table = (
            this.getTargetMetadata(table).tableName
        )

        this._isForeignKey = true
        this._references = {
            constrained: true,
            tableName: table as string,
            columnName: column,
        }

        return this
    }

    // ------------------------------------------------------------------------

    public onUpdate(action: ForeignKeyActionListener): this {
        if (!this._isForeignKey) throw new Error

        this._references!.onUpdate = action
        return this
    }

    // ------------------------------------------------------------------------

    public onDelete(action: ForeignKeyActionListener): this {
        if (!this._isForeignKey) throw new Error

        this._references!.onDelete = action
        return this
    }

    // ------------------------------------------------------------------------

    public createSQL() {
        const foreignKeySQL = this.foreignKeySQL()

        return SQLStringHelper.normalizeSQL(`
            ${this.columnSQL()}
            ${foreignKeySQL ? `, ${foreignKeySQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public addSQL() {
        const foreignKeySQL = this.addForeignKeySQL()

        return SQLStringHelper.normalizeSQL(`
            ADD COLUMN ${this.columnSQL()}
            ${foreignKeySQL ? `, ${foreignKeySQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public addForeignKeySQL() {
        const foreignKeySQL = this.foreignKeySQL()
        return foreignKeySQL
            ? `ADD ${foreignKeySQL}`
            : ''
    }

    // ------------------------------------------------------------------------

    public modifySQL(schema?: ColumnSchema) {
        const fkSQL = schema ? this.modifyForeignKeySQL(schema) : ''

        return SQLStringHelper.normalizeSQL(`
            MODIFY COLUMN ${this.columnSQL()}
            ${fkSQL ? `, ${fkSQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public modifyForeignKeySQL(schema: ColumnSchema): string {
        switch (this.foreignKeyAction(schema)) {
            case 'ADD': return this.addForeignKeySQL()
            case 'ALTER': return `
                ${this.dropForeignKeySQL()},
                ${this.addForeignKeySQL()}
            `
            case 'DROP': return this.dropForeignKeySQL()

            case 'NONE': return ''
        }
    }

    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return SQLStringHelper.normalizeSQL(
            `${this.shouldDropForeignKeySQL()} DROP COLUMN ${this.name}`
        )
    }

    // ------------------------------------------------------------------------

    public dropForeignKeySQL(): string {
        return this._references
            ? `DROP FOREIGN KEY ${this._references.name}`
            : ''
    }

    // ------------------------------------------------------------------------

    public actionSQL(schema?: ColumnSchema): string | undefined {
        switch (this.compare(schema)[0]) {
            case 'ADD': return this.addSQL()
            case 'ALTER': return this.modifySQL()
            case 'DROP': return this.dropSQL()
        }
    }

    // ------------------------------------------------------------------------

    public compare(schema?: ColumnSchema): (
        [ColumnSchemaAction, ColumnSchemaAction]
    ) {
        if (!this._action) this._action = this.action(schema) as (
            ColumnSchemaAction
        )

        if (!this._fkAction) this._fkAction = schema
            ? this.foreignKeyAction(schema)
            : 'NONE'

        return [this._action, this._fkAction]
    }

    // Privates ---------------------------------------------------------------
    private getTargetMetadata(target: EntityTarget): EntityMetadata {
        const meta = EntityMetadata.find(target)
        if (!meta) throw new Error

        return meta
    }

    // ------------------------------------------------------------------------

    private action(schema?: ColumnSchema): Omit<ColumnSchemaAction, 'DROP'> {
        switch (true) {
            case !schema: return 'ADD';
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    private foreignKeyAction(schema: ColumnSchema): (
        ColumnSchemaAction
    ) {
        switch (true) {
            case !schema._isForeignKey && this._isForeignKey: return 'ADD'
            case schema._isForeignKey && !this._isForeignKey: return 'DROP'

            case (
                !!schema._references &&
                !!this._references &&
                this.shouldAlterForeignKey(schema._references)
            ): return 'ALTER'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    private shouldAlter(schema: ColumnSchema): boolean {
        const compare = Object.entries(this).filter(([key]) =>
            ColumnSchema.compareKeys.includes(key)
        ) as (
                [keyof ColumnSchema, any][]
            )

        for (const [key, value] of compare)
            if (typeof value !== 'object')
                if (value !== schema[key]) return true

        if (!this.compareDataTypes(this.dataType, schema.dataType)) return true

        return false
    }

    // ------------------------------------------------------------------------

    private shouldAlterForeignKey(references: ForeignKeyReferences): boolean {
        for (const [key, value] of Object.entries(this._references!) as (
            [keyof ForeignKeyReferences, string | null][]
        ))
            if (references[key] !== value) return true

        return false
    }

    // ------------------------------------------------------------------------

    private shouldDropForeignKeySQL(): string {
        return this._isForeignKey
            ? this.dropForeignKeySQL()
            : ''
    }

    // ------------------------------------------------------------------------

    private compareDataTypes(
        previous: DataType | string,
        current: DataType | string
    ): boolean {
        switch (typeof previous) {
            case "string": switch (typeof current) {
                case "string": return previous === current
                case "object": return this.compareStrAndObjDataTypes(
                    previous,
                    current
                )
            }
            case "object": switch (typeof current) {
                case "string": return this.compareStrAndObjDataTypes(
                    current,
                    previous
                )
                case "object": return (
                    previous.buildSQL() === current.buildSQL()
                )
            }
        }
    }

    // ------------------------------------------------------------------------

    private compareStrAndObjDataTypes(
        string: string,
        object: DataType
    ): boolean {
        return object
            .buildSQL()
            .replace(
                object.type.toUpperCase(),
                object.type
            )
            === string
    }

    // ------------------------------------------------------------------------

    private columnSQL() {
        return [
            this.nameSQL(),
            this.typeSQL(),
            this.unsignedSQL(),
            this.nullSQL(),
            this.uniqueSQL(),
            this.primarySQL(),
            this.autoIncrementSQL(),
            this.defaultSQL()
        ].join(' ')
    }

    // ------------------------------------------------------------------------

    private nameSQL() {
        return `\`${this.name}\``
    }

    // ------------------------------------------------------------------------

    private typeSQL() {
        if (!DataType.isDataType(this.dataType)) throw new Error
        return (this.dataType as DataType).buildSQL()
    }

    // ------------------------------------------------------------------------

    private unsignedSQL() {
        return this._unsigned ? 'UNSIGNED' : ''
    }

    // ------------------------------------------------------------------------

    private nullSQL() {
        return this._nullable ? 'NULL' : 'NOT NULL'
    }

    // ------------------------------------------------------------------------

    private uniqueSQL() {
        return this._unique ? 'UNIQUE' : ''
    }

    // ------------------------------------------------------------------------

    private primarySQL() {
        return this._primary ? 'PRIMARY KEY' : ''
    }

    // ------------------------------------------------------------------------

    private autoIncrementSQL() {
        return this._autoIncrement ? 'AUTO_INCREMENT' : ''
    }

    // ------------------------------------------------------------------------

    private defaultSQL() {
        return this._defaultValue
            ? `DEFAULT ${this.formatDefaultValue(this._defaultValue)}`
            : ''
    }

    // ------------------------------------------------------------------------

    private formatDefaultValue(def: any) {
        switch (typeof def) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
            case "object": return JSON.stringify(def)
            case "function": return def()

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private foreignKeySQL() {
        return (this._isForeignKey && this._references?.constrained)
            ? `
                , CONSTRAINT ${this.foreignKeyName}
                    FOREIGN KEY (${this.name}) ${this.foreignKeyReferences()}`
            : ''
    }

    // ------------------------------------------------------------------------

    private foreignKeyReferences() {
        const {
            tableName,
            columnName,
            onDelete,
            onUpdate
        } = this._references!

        const onDelSQL = onDelete ? ` ON DELETE ${onDelete}` : ''
        const onUpdSQL = onUpdate ? ` ON UPDATE ${onUpdate}` : ''

        return (
            `REFERENCES ${tableName}(${columnName})${onDelSQL}${onUpdSQL}`
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadata(
        metadata: ColumnMetadata | JoinColumnMetadata
    ): ColumnSchema {
        const { references, dataType } = metadata

        const ref: ForeignKeyReferences | undefined = references
            ? {
                tableName: (references.entity as any).tableName as string,
                columnName: (references.column as any).name as string,
                constrained: references.constrained,
                onUpdate: references.onUpdate,
                onDelete: references.onDelete
            }

            : undefined

        return new ColumnSchema({
            tableName: metadata.tableName,
            ...metadata.toJSON(),
            dataType,
            references: ref,
        })
    }
}

export type {
    ColumnSchemaInitMap
}