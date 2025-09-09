import {
    DataType,
    EntityMetadata,
    ColumnMetadata,
    JoinColumnMetadata,

    type ForeignKeyActionListener
} from "../../../Metadata"

import ForeignKeyReferencesSchema from "./ForeignKeyReferencesSchema"

// Types
import type { EntityTarget, Constructor } from "../../../../types/General"
import type { ColumnPattern } from "../../../Metadata"
import type { ActionType } from "../../types"
import type {
    ColumnSchemaInitMap,
    ColumnSchemaMap,
    ColumnSchemaAction
} from "./types"

export default class ColumnSchema {
    public tableName!: string
    public name!: string
    public dataType!: DataType | string

    public pattern?: ColumnPattern

    public map: ColumnSchemaMap = {
        nullable: true
    }

    public actions: ColumnSchemaAction[] = []

    protected _action?: ActionType
    protected _fkAction?: ActionType

    constructor({ name, tableName, dataType, pattern, ...rest }: (
        ColumnSchemaInitMap
    )) {
        this.name = name
        this.tableName = tableName
        this.dataType = dataType
        this.pattern = pattern

        const { references, ...map } = rest
        this.map = map

        if (references) this.map.references = (
            references instanceof ForeignKeyReferencesSchema
        )
            ? references
            : new ForeignKeyReferencesSchema(
                this.tableName,
                this.name,
                references
            )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get foreignKeyConstraint(): ForeignKeyReferencesSchema | undefined {
        return this.map.references
    }

    // ------------------------------------------------------------------------

    public get foreignKeyName(): string | undefined {
        return this.map.references?.name
    }

    // ------------------------------------------------------------------------

    public get dependence(): string | undefined {
        if (this.map.isForeignKey) return (
            this.map.references!.map.tableName as string
        )
    }

    // Static Getters =========================================================
    // Protecteds =============================================================
    protected static get ForeignKeyConstructor(): (
        typeof ForeignKeyReferencesSchema
    ) {
        return ForeignKeyReferencesSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public primary(primary: boolean = true): this {
        this.map.primary = primary
        return this
    }

    // ------------------------------------------------------------------------

    public nullable(nullable: boolean = true): this {
        this.map.nullable = nullable
        return this
    }

    // ------------------------------------------------------------------------

    public default(value: any): this {
        this.map.defaultValue = value
        return this
    }

    // ------------------------------------------------------------------------

    public autoIncrement(autoIncrement: boolean = true): this {
        this.map.autoIncrement = autoIncrement
        return this
    }

    // ------------------------------------------------------------------------

    public unsigned(unsigned: boolean = true): this {
        this.map.unsigned = unsigned
        return this
    }

    // ------------------------------------------------------------------------

    public unique(unique: boolean = true): this {
        this.map.unique = unique
        return this
    }

    // ------------------------------------------------------------------------

    public foreignKey(
        table: string | EntityTarget,
        column: string
    ): this {
        this.map.isForeignKey = true
        this.constrained().references(table, column)

        return this
    }

    // ------------------------------------------------------------------------

    public onUpdate(action: ForeignKeyActionListener): this {
        if (!this.map.isForeignKey) throw new Error

        this.map.references!.onUpdate(action)
        return this
    }

    // ------------------------------------------------------------------------

    public onDelete(action: ForeignKeyActionListener): this {
        if (!this.map.isForeignKey) throw new Error

        this.map.references!.onDelete(action)
        return this
    }

    // ------------------------------------------------------------------------

    public constrained(): ForeignKeyReferencesSchema {
        if (this.map.references) throw new Error

        this.map.isForeignKey = true
        this.map.references = new ForeignKeyReferencesSchema(
            this.tableName,
            this.name,
            {
                constrained: true
            }
        )
        this.actions.push(['CREATE', this.map.references])

        return this.map.references
    }

    // ------------------------------------------------------------------------

    public alterConstraint(): ForeignKeyReferencesSchema {
        if (!this.map.references) throw new Error
        this.actions.push(['ALTER', this.map.references])

        return this.map.references
    }

    // ------------------------------------------------------------------------

    public dropConstraint(): void {
        if (!this.map.references) throw new Error
        this.actions.push(['DROP', this.map.references])
    }

    // ------------------------------------------------------------------------

    public compare(schema?: ColumnSchema): [ActionType, ActionType] {
        if (!this._action) this._action = this.action(schema) as ActionType

        if (!this._fkAction) this._fkAction = schema
            ? this.foreignKeyAction(schema)
            : 'NONE'

        return [this._action, this._fkAction]
    }

    // Protecteds -------------------------------------------------------------
    protected getTargetMetadata(target: EntityTarget): EntityMetadata {
        const meta = EntityMetadata.find(target)
        if (!meta) throw new Error

        return meta
    }

    // ------------------------------------------------------------------------

    protected action(schema?: ColumnSchema): Omit<ActionType, 'DROP'> {
        switch (true) {
            case !schema: return 'CREATE';
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    protected foreignKeyAction(schema: ColumnSchema): (
        ActionType
    ) {


        switch (true) {
            case (
                !schema.map.isForeignKey &&
                this.map.isForeignKey
            ): return 'CREATE'

            case (
                schema.map.isForeignKey &&
                !this.map.isForeignKey
            ): return 'DROP'

            case (
                !!schema.map.references &&
                !!this.map.references &&
                this.shouldAlterForeignKey(schema.map.references)
            ): return 'ALTER'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    protected shouldAlter(schema: ColumnSchema): boolean {
        const { references, ...map } = this.map

        for (const [key, value] of Object.entries(map) as (
            [keyof ColumnSchemaMap, any][]
        ))
            if (!this.compareValues(value, schema.map[key])) return true

        if (!this.compareDataTypes(typeof schema.dataType === 'string'
            ? schema.map.columnType!
            : schema.dataType
        )) return true

        return false
    }

    // ------------------------------------------------------------------------

    protected shouldAlterForeignKey(references: ForeignKeyReferencesSchema): (
        boolean
    ) {
        for (const [key, value] of Object.entries(this.map.references!) as (
            [keyof ForeignKeyReferencesSchema, string | null][]
        ))
            if (!this.compareValues(value, references[key])) return true

        return false
    }

    // ------------------------------------------------------------------------

    protected compareDataTypes(
        dataTypeA: DataType | string,
        dataTypeB: DataType | string = this.dataType
    ): boolean {
        switch (typeof dataTypeA) {
            case "string": switch (typeof dataTypeB) {
                case "string": return dataTypeA === dataTypeB
                case "object": return this.compareStrAndObjDataTypes(
                    dataTypeA,
                    dataTypeB
                )
            }
            case "object": switch (typeof dataTypeB) {
                case "string": return this.compareStrAndObjDataTypes(
                    dataTypeB,
                    dataTypeA
                )
                case "object": return (
                    dataTypeA.buildSQL() === dataTypeB.buildSQL()
                )
            }
        }
    }

    // ------------------------------------------------------------------------

    protected compareStrAndObjDataTypes(
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
                .replace('unsigned', '')
                .trim()
    }

    // ------------------------------------------------------------------------

    protected compareValues(value: any, compare: any): boolean {
        switch (typeof value) {
            case "string":
            case "number":
            case "bigint": return value === compare
            case "boolean": return value === !!compare
            case "undefined": return !compare
            case "function": return value() === compare

            default: return true
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadata<T extends Constructor<ColumnSchema>>(
        this: T,
        metadata: ColumnMetadata | JoinColumnMetadata
    ): InstanceType<T> {
        const { tableName, name, references, dataType } = metadata

        return new this({
            ...metadata.toJSON(),
            tableName,
            dataType,
            references: references
                ? new (this as T & typeof ColumnSchema).ForeignKeyConstructor(
                    tableName,
                    name,
                    {
                        tableName: (references.entity as EntityMetadata)
                            .tableName,

                        columnName: (references.column as ColumnMetadata)
                            .name,

                        name: references.name,
                        constrained: references.constrained,
                        onUpdate: references.onUpdate,
                        onDelete: references.onDelete
                    })

                : undefined,
        }) as InstanceType<T>
    }
}

export {
    ForeignKeyReferencesSchema,

    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
}