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
import type {
    ColumnSchemaInitMap,
    ColumnSchemaMap,
    ColumnSchemaAction
} from "./types"

export default class ColumnSchema {
    public tableName!: string
    public name!: string
    public dataType!: DataType | string

    public map: ColumnSchemaMap = {
        nullable: false
    }

    protected actions: ColumnSchemaAction[] = []

    constructor({ name, tableName, dataType, ...rest }: (
        ColumnSchemaInitMap
    )) {
        this.name = name
        this.tableName = tableName
        this.dataType = dataType

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
        this.map.isForeignKey = true
        this.constained().references(table, column)

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

    public constained(): ForeignKeyReferencesSchema {
        if (this.map.references) throw new Error

        this.map.references = new ForeignKeyReferencesSchema(
            this.tableName,
            this.name
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