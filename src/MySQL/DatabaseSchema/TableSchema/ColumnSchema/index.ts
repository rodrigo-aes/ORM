import {
    DataType,
    EntityMetadata,
    ColumnMetadata,
    JoinColumnMetadata,

    type ForeignKeyActionListener
} from "../../../Metadata"

// Types
import type { EntityTarget, Constructor } from "../../../../types/General"
import type {
    ColumnSchemaInitMap,
    ForeignKeyReferencesSchema
} from "./types"

export default class ColumnSchema {
    public tableName!: string
    public name!: string
    public dataType!: DataType | string

    public _primary?: boolean
    public _nullable?: boolean
    public _autoIncrement?: boolean
    public _defaultValue?: string | number | null
    public _unsigned?: boolean
    public _unique?: boolean
    public _isForeignKey?: boolean
    public _references?: ForeignKeyReferencesSchema

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

    // Protecteds -------------------------------------------------------------
    protected getTargetMetadata(target: EntityTarget): EntityMetadata {
        const meta = EntityMetadata.find(target)
        if (!meta) throw new Error

        return meta
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadata<T extends Constructor<ColumnSchema>>(
        this: T,
        metadata: ColumnMetadata | JoinColumnMetadata
    ): InstanceType<T> {
        const { references, dataType } = metadata

        const ref: ForeignKeyReferencesSchema | undefined = references
            ? {
                tableName: (references.entity as any).tableName as string,
                columnName: (references.column as any).name as string,
                constrained: references.constrained,
                onUpdate: references.onUpdate,
                onDelete: references.onDelete
            }

            : undefined

        return new this({
            tableName: metadata.tableName,
            ...metadata.toJSON(),
            dataType,
            references: ref,
        }) as InstanceType<T>
    }
}

export type {
    ColumnSchemaInitMap,
    ForeignKeyReferencesSchema,
}