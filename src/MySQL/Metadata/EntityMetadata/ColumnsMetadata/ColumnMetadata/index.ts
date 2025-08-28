// Metadata
import EntityMetadata from "../../"
import DataType from "../../DataType"
import TriggersMetadata from "../../TriggersMetadata"

// Objects
import ForeignKeyReferences, {
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
    type ForeignKeyReferencesInitMap,
    type ForeignKeyReferencesJSON
} from "./ForeignKeyReferences"

// Triggers
import { PolymorphicId } from "../../../../Triggers"

// Types
import type { EntityTarget } from "../../../../../types/General"
import type {
    SQLColumnType,
    ColumnPattern,
    ColumnConfig,
    ForeignIdConfig,
    PolymorphicForeignIdConfig,
    ColumnMetadataJSON
} from "./types"

export default class ColumnMetadata {
    public length?: number
    public nullable?: boolean
    public defaultValue?: any
    public unique?: boolean
    public primary?: boolean
    public autoIncrement?: boolean
    public unsigned?: boolean
    public isForeignKey?: boolean
    public references?: ForeignKeyReferences

    // public beforeUpdate: ColumnBeforeUpdateListener[] = []

    constructor(
        public target: EntityTarget,
        public name: string,
        public dataType: DataType
    ) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get tableName(): string {
        return this.targetMetadata.tableName
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public defineForeignKey(initMap: ForeignKeyReferencesInitMap) {
        this.isForeignKey = true
        this.references = new ForeignKeyReferences(
            this.target,
            this.name,
            initMap
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): ColumnMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                dataType: this.dataType.toJSON(),
                references: this.references?.toJSON()
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'length',
                    'nullable',
                    'defaultValue',
                    'unique',
                    'primary',
                    'autoIncrement',
                    'unsigned',
                    'isForeignKey',
                ]
                    .includes(key)
            )
        ]) as ColumnMetadataJSON
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildPattern(
        target: EntityTarget,
        name: string,
        pattern: ColumnPattern,
        ...rest: any[]
    ) {
        switch (pattern) {
            case 'id': return this.buildIdColumn(target, name)

            case 'polymorphicId': return this.buildPolymorphicIdColumn(
                target, name
            )

            case 'foreign-id': return this.buildForeignIdcolumn(
                target, name, ...(rest as [ForeignIdConfig])
            )

            case 'polymorphic-foreign-id': return (
                this.buildPolymorphicForeignId(
                    target,
                    name,
                    ...(rest as [PolymorphicForeignIdConfig])
                )
            )

            case "created-timestamp": return this.buildCreateDateColumn(
                target, name
            )

            case "updated-timestamp": return this.buildUpdateDateColumn(
                target, name
            )
        }
    }

    // ------------------------------------------------------------------------

    public static buildIdColumn(target: EntityTarget, name: string) {
        const column = new ColumnMetadata(target, name, DataType.INT('BIG'))

        Object.assign(column, {
            primary: true,
            unsigned: true,
            autoIncrement: true,
            nullable: false,
        })

        return column
    }

    // ------------------------------------------------------------------------

    public static buildPolymorphicIdColumn(
        target: EntityTarget,
        name: string
    ) {
        const column = new ColumnMetadata(target, name, DataType.VARCHAR())

        Object.assign(column, {
            primary: true,
            nullable: false,
        })

        TriggersMetadata.findOrBuild(target).addTrigger(PolymorphicId)

        return column
    }

    // ------------------------------------------------------------------------

    public static buildForeignIdcolumn(
        target: EntityTarget,
        name: string,
        config: ForeignIdConfig
    ) {
        const column = new ColumnMetadata(target, name, DataType.INT('BIG'))

        Object.assign(column, {
            isForeignKey: true,
            unsigned: true,
        })

        column.defineForeignKey({
            constrained: true,
            ...config
        })

        return column
    }

    // ------------------------------------------------------------------------

    public static buildPolymorphicForeignId(
        target: EntityTarget,
        name: string,
        config: PolymorphicForeignIdConfig
    ) {
        const column = new ColumnMetadata(target, name, DataType.VARCHAR())

        Object.assign(column, { isForeignKey: true })
        column.defineForeignKey(config)

        return column
    }

    // ------------------------------------------------------------------------

    public static buildCreateDateColumn(target: EntityTarget, name: string) {
        const column = new ColumnMetadata(target, name, DataType.TIMESTAMP())

        Object.assign(column, {
            nullable: false,
            defaultValue: () => 'CURRENT_TIMESTAMP',
        })

        return column
    }

    // ------------------------------------------------------------------------

    public static buildUpdateDateColumn(target: EntityTarget, name: string) {
        const column = new ColumnMetadata(target, name, DataType.TIMESTAMP())

        Object.assign(column, {
            nullable: false,
            defaultValue: () => 'CURRENT_TIMESTAMP',
            beforeUpdate: [
                () => Date.now()
            ]
        })

        return column
    }
}

export type {
    SQLColumnType,
    ColumnPattern,
    ColumnConfig,
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignIdConfig,
    PolymorphicForeignIdConfig,
    ColumnMetadataJSON,
    ForeignKeyReferencesJSON
}