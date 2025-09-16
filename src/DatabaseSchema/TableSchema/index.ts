import {
    EntityMetadata,
    DataType,

    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType
} from "../../Metadata"

import ColumnSchema, {
    ForeignKeyReferencesSchema,

    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ForeignKeyReferencesSchemaMap
} from "./ColumnSchema"

// Triggers
import { PolymorphicId } from "../../Triggers"

// Symbols
import { CurrentTimestamp } from "../../SQLBuilders"

// Types
import type { EntityTarget, Constructor } from "../../types/General"
import type DatabaseSchema from ".."
import type { TriggerSchema } from "../TriggersSchema"
import type { TableSchemaInitMap, TableSchemaAction } from "./types"
import { ActionType } from ".."

export default class TableSchema<
    T extends ColumnSchema = ColumnSchema
> extends Array<T> {
    public dependencies: string[]
    public actions: TableSchemaAction[] = []

    constructor(
        public database: DatabaseSchema | undefined = undefined,
        public name: string,
        ...columns: (T | Omit<ColumnSchemaInitMap, 'tableName'>)[]
    ) {
        super(...columns.map(col => col instanceof ColumnSchema
            ? col
            : new ColumnSchema({
                ...col,
                tableName: name
            }) as T
        ))

        this.dependencies = this.flatMap(({ dependence }) => dependence ?? [])
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected static get ColumnConstructor(): typeof ColumnSchema {
        return ColumnSchema
    }

    // Satatic Getters ========================================================
    // Publics ----------------------------------------------------------------
    public static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public id(name?: string): void {
        this.buildColumn(name ?? 'id', DataType.INT('BIG'))
            .primary()
            .unsigned()
            .autoIncrement()
    }

    // ------------------------------------------------------------------------

    public polymorphicId(prefix: EntityTarget | string, name?: string): void {
        this.buildColumn('id', DataType.VARCHAR()).primary()

        this.buildTrigger(`${this.name}_polymorphic_pk`)
            .before('INSERT')
            .forEach('ROW')
            .execute(PolymorphicId.actionSQL(
                this.name,
                name ?? 'id',
                typeof prefix === 'string' ? prefix : prefix.name,
            ))
    }

    // ------------------------------------------------------------------------

    public foreignId(name: string): T {
        const col = this.buildColumn(name, DataType.INT('BIG'))
            .unsigned()

        col.map.isForeignKey = true

        return col
    }

    // ------------------------------------------------------------------------

    public foreignIdFor(target: EntityTarget, name?: string): (
        ForeignKeyReferencesSchema
    ) {
        const meta = EntityMetadata.find(target)
        if (!meta) throw new Error

        const pk = meta.columns.primary
        name = name ?? `${meta.target.name.toLowerCase()}_id`

        return this.buildColumn(name, pk.dataType)
            .unsigned()
            .constrained()
            .references(target, pk.name)
    }

    // ------------------------------------------------------------------------

    public polymorphicForeignId(name: string): T {
        const col = this.buildColumn(name, DataType.VARCHAR())
        col.map.isForeignKey = true

        return col
    }

    // ------------------------------------------------------------------------

    public polymorphicTypeKey(
        name: string,
        ...types: (EntityTarget | string)[]
    ): T {
        return this.buildColumn(name, DataType.ENUM(...types.map(
            type => typeof type === 'string' ? type : type.name
        )))
    }

    // ------------------------------------------------------------------------

    public createdTimestamp(): void {
        this.buildColumn('createdAt', DataType.TIMESTAMP())
            .default(CurrentTimestamp)
    }

    // ------------------------------------------------------------------------

    public updatedTimestamp(): void {
        this.buildColumn('updatedAt', DataType.TIMESTAMP())
            .default(CurrentTimestamp)
    }

    // ------------------------------------------------------------------------

    public timestamps(): void {
        this.createdTimestamp()
        this.updatedTimestamp()
    }

    // ------------------------------------------------------------------------

    public column(name: string, dataType: DataType): T {
        return this.buildColumn(name, dataType)
    }

    // ------------------------------------------------------------------------

    public string(name: string, length?: number): T {
        return this.buildColumn(name, DataType.VARCHAR(length))
    }

    // ------------------------------------------------------------------------

    public char(name: string, length?: number): T {
        return this.buildColumn(name, DataType.CHAR(length))
    }

    // ------------------------------------------------------------------------

    public text(name: string, length?: TextLength): T {
        return this.buildColumn(name, DataType.TEXT(length))
    }

    // ------------------------------------------------------------------------

    public int(name: string, length?: IntegerLength): T {
        return this.buildColumn(name, DataType.INT(length))
    }

    // ------------------------------------------------------------------------

    public bigint(name: string): T {
        return this.buildColumn(name, DataType.INT('BIG'))
    }

    // ------------------------------------------------------------------------

    public tinyint(name: string): T {
        return this.buildColumn(name, DataType.INT('TINY'))
    }

    // ------------------------------------------------------------------------

    public float(name: string, M: number, D: number): T {
        return this.buildColumn(name, DataType.FLOAT(M, D))
    }

    // ------------------------------------------------------------------------

    public decimal(name: string, M: number, D: number): T {
        return this.buildColumn(name, DataType.DECIMAL(M, D))
    }

    // ------------------------------------------------------------------------

    public double(name: string, M: number, D: number): T {
        return this.buildColumn(name, DataType.DOUBLE(M, D))
    }

    // ------------------------------------------------------------------------

    public boolean(name: string): T {
        return this.buildColumn(name, DataType.BOOLEAN())
    }

    // ------------------------------------------------------------------------

    public enum(name: string, options: string[]): T {
        return this.buildColumn(name, DataType.ENUM(...options))
    }

    // ------------------------------------------------------------------------

    public set(name: string, options: string[]): T {
        return this.buildColumn(name, DataType.SET(...options))
    }

    // ------------------------------------------------------------------------

    public timestamp(name: string): T {
        return this.buildColumn(name, DataType.TIMESTAMP())
    }

    // ------------------------------------------------------------------------

    public datetime(name: string): T {
        return this.buildColumn(name, DataType.DATETIME())
    }

    // ------------------------------------------------------------------------

    public date(name: string): T {
        return this.buildColumn(name, DataType.DATE())
    }

    // ------------------------------------------------------------------------

    public time(name: string): T {
        return this.buildColumn(name, DataType.TIME())
    }

    // ------------------------------------------------------------------------

    public year(name: string): T {
        return this.buildColumn(name, DataType.YEAR())
    }

    // ------------------------------------------------------------------------

    public json(name: string): T {
        return this.buildColumn(name, DataType.JSON())
    }

    // ------------------------------------------------------------------------

    public jsonRef(
        name: string,
        dataType: DataType,
        config: JSONColumnConfig
    ): T {
        return this.buildColumn(name, DataType.JSONReference(dataType, config))
    }

    // ------------------------------------------------------------------------

    public bit(name: string, length?: BitLength): T {
        return this.buildColumn(name, DataType.BIT(length))
    }

    // ------------------------------------------------------------------------

    public binary(name: string, length: number): T {
        return this.buildColumn(name, DataType.BINARY(length))
    }

    // ------------------------------------------------------------------------

    public varbinary(name: string, length: number): T {
        return this.buildColumn(name, DataType.VARBINARY(length))
    }

    // ------------------------------------------------------------------------

    public blob(name: string, length?: BlobLength): T {
        return this.buildColumn(name, DataType.BLOB(length))
    }

    // ------------------------------------------------------------------------

    public computed(
        name: string,
        dataType: DataType,
        as: string,
        type: ComputedType
    ): T {
        return this.buildColumn(name, DataType.COMPUTED(dataType, as, type))
    }

    // ------------------------------------------------------------------------

    public alterColumn(name: string): T {
        const col = this.findOrThrow(name)

        this.beforeAlterActions(col)
        this.actions.push(['ALTER', col])
        this.afterAlterActions(col)

        return col
    }

    // ------------------------------------------------------------------------

    public dropColumn(name: string): void {
        const col = this.findOrThrow(name)
        this.actions.push(['DROP', col])
    }

    // ------------------------------------------------------------------------

    public addConstraint(column: string): ForeignKeyReferencesSchema {
        const col = this.findOrThrow(column)
        if (col.map.references) throw new Error

        if (this.colAlreadyInActions(column)) return col.constrained()

        col.map.references = new ForeignKeyReferencesSchema(
            this.name,
            col.name
        )
        this.actions.push(['CREATE', col.map.references])

        return col.map.references
    }

    // ------------------------------------------------------------------------

    public alterConstraint(column: string): ForeignKeyReferencesSchema {
        const col = this.findOrThrow(column)
        if (!col.map.references) throw new Error

        if (this.colAlreadyInActions(column)) return col.alterConstraint()

        this.actions.push(['ALTER', col.map.references])

        return col.map.references
    }

    // ------------------------------------------------------------------------

    public dropConstraint(column: string): void {
        const col = this.findOrThrow(column)
        if (!col.map.references) throw new Error

        if (this.colAlreadyInActions(column)) return col.dropConstraint()

        this.actions.push(['DROP', col.map.references])
    }

    // ------------------------------------------------------------------------

    public findColumn(columnName: string) {
        return this.find(col => col.name === columnName)
    }

    // ------------------------------------------------------------------------

    /**
     * 
     * @internal
     */
    public compare(schema?: TableSchema): Omit<ActionType, 'DROP'> {
        switch (true) {
            case !schema: return 'CREATE'
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // Protecteds -------------------------------------------------------------
    protected buildColumn(name: string, dataType: DataType): T {
        const col = new ColumnSchema({
            tableName: this.name,
            name,
            dataType
        }) as T

        this.push(col)
        this.actions.push(['CREATE', col])

        return col
    }

    // ------------------------------------------------------------------------

    protected buildTrigger(name: string): TriggerSchema {
        return this.database!.createTrigger(this.name, name)
    }

    // ------------------------------------------------------------------------

    protected shouldAlter(schema: TableSchema): boolean {
        const diff = this.some(column => {
            const [action, fkAction] = column.compare(
                schema.findColumn(column.name)
            )

            return action !== 'NONE' || fkAction !== 'NONE'
        })

        const shouldDrop = schema.some(({ name }) => !this.findColumn(name))

        return diff || shouldDrop
    }

    // Privates ---------------------------------------------------------------
    private findOrThrow(name: string): T {
        const col = this.findColumn(name)
        if (!col) throw new Error

        return col
    }

    // ------------------------------------------------------------------------

    private colAlreadyInActions(column: string): boolean {
        return !!this.actions.find(([_, { name }]) => name === column)
    }

    // ------------------------------------------------------------------------

    private beforeAlterActions(column: ColumnSchema): void {
        if (column.map.primary) this.actions.push(['DROP-PK', column])
        if (column.map.unique) this.actions.push(['DROP-UNIQUE', column])
    }

    // ------------------------------------------------------------------------

    private afterAlterActions(column: ColumnSchema): void {
        if (column.map.primary) this.actions.push(['ADD-PK', column])
        if (column.map.unique) this.actions.push(['ADD-UNIQUE', column])
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadata<T extends Constructor<TableSchema>>(
        this: T,
        database: DatabaseSchema,
        source: EntityMetadata | EntityTarget
    ): InstanceType<T> {
        const { tableName, columns } = (this as T & typeof TableSchema)
            .metadataFromSource(source)

        return new this(
            database,
            tableName,
            ...columns.map(
                column => (this as T & typeof TableSchema)
                    .ColumnConstructor
                    .buildFromMetadata(column)
            )
        ) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static buildJoinTablesFromMetadata(
        database: DatabaseSchema,
        source: EntityMetadata | EntityTarget
    ): TableSchema[] {
        return this.metadataFromSource(source).joinTables?.map(
            ({ tableName, columns }) => new this(
                database,
                tableName,
                ...columns.map(
                    column => this.ColumnConstructor.buildFromMetadata(column)
                )
            )
        )
            ?? []
    }

    // Privates ---------------------------------------------------------------
    private static metadataFromSource(source: EntityMetadata | EntityTarget) {
        const metadata = source instanceof EntityMetadata
            ? source
            : EntityMetadata.find(source)

        if (!metadata) throw new Error

        return metadata
    }
}

export {
    ColumnSchema,
    ForeignKeyReferencesSchema,

    type TableSchemaInitMap,
    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ForeignKeyReferencesSchemaMap
}