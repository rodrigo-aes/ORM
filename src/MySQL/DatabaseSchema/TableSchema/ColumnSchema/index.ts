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
    ColumnPropertiesMap,
    ForeignKeyReferencesSchema
} from "./types"

export default class ColumnSchema {
    public tableName!: string
    public name!: string
    public dataType!: DataType | string

    public map!: ColumnPropertiesMap

    constructor({ name, tableName, dataType, ...map }: (
        ColumnSchemaInitMap
    )) {
        Object.assign(this, { name, tableName, dataType })
        this.map = map
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get foreignKeyName(): string | undefined {
        if (this.map.references?.constrained) return (
            this.map.references.name ?? (
                `fk_${this.tableName}_${this.map.references.columnName}`
            )
        )
    }

    // ------------------------------------------------------------------------

    public get dependence(): string | undefined {
        if (this.map.isForeignKey) return this.map.references!.tableName as (
            string
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public primary(): this {
        this.map.primary = true
        return this
    }

    // ------------------------------------------------------------------------

    public nullable(nullable: boolean = true): this {
        this.map.nullable = nullable
        return this
    }

    // ------------------------------------------------------------------------

    public autoIncrement(): this {
        this.map.autoIncrement = true
        return this
    }

    // ------------------------------------------------------------------------

    public unsigned(): this {
        this.map.unsigned = true
        return this
    }

    // ------------------------------------------------------------------------

    public unique(): this {
        this.map.unique = true
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

        this.map.isForeignKey = true
        this.map.references = {
            constrained: true,
            tableName: table as string,
            columnName: column,
        }

        return this
    }

    // ------------------------------------------------------------------------

    public onUpdate(action: ForeignKeyActionListener): this {
        if (!this.map.isForeignKey) throw new Error

        this.map.references!.onUpdate = action
        return this
    }

    // ------------------------------------------------------------------------

    public onDelete(action: ForeignKeyActionListener): this {
        if (!this.map.isForeignKey) throw new Error

        this.map.references!.onDelete = action
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
                name: references.name,
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
    ColumnPropertiesMap,
    ForeignKeyReferencesSchema,
}